import { Octokit } from '@octokit/core'
import { simpleGit } from 'simple-git'
import { writeFileSync, readFileSync } from 'fs'
import { zipBuildFolder } from './parts/archive.js'
import { getPackageFile, PACKAGE_FILE_PATH } from './parts/general.js'

function getGithubLinkFromPackage(myPackage) {
    const githubPath = myPackage.repository.replace('github:', '').split('/')
    return { owner: githubPath[0], repo: githubPath[1] }
}

function getSymVerFromPackage(myPackage) {
    const currentVersion = myPackage.version.replace(/-.*/, '').split('.').map(Number)

    const major = currentVersion[0]
    const minor = currentVersion[1]
    const patch = currentVersion[2]

    return {
        major,
        minor,
        patch,
        get version() {
            return `${this.major}.${this.minor}.${this.patch}`
        },
        newMajor() {
            this.major += 1
            return this.version
        },
        newMinor() {
            this.minor += 1
            return this.version
        },
        newPatch() {
            this.patch += 1
            return this.version
        },
    }
}

function writeVersionToPackage(newVersion) {
    const packageFile = getPackageFile()
    packageFile.version = newVersion

    writeFileSync(PACKAGE_FILE_PATH, JSON.stringify(packageFile, undefined, 2))
}

async function uploadBuildZIP(octokit, { uploadUrl, archiveFile }) {
    await octokit.request({
        method: 'POST',
        url: uploadUrl,
        headers: {
            'content-type': 'application/zip',
        },
        data: archiveFile,
        name: ARCHIVE_FILE_NAME,
    })

    console.log('Uploaded build archive %s to release', ARCHIVE_FILE_NAME)
}

async function createRelease(octokit, { owner, repo, versionTag }) {
    const release = await octokit.request('POST /repos/{owner}/{repo}/releases', {
        owner: owner,
        repo: repo,
        tag_name: versionTag,
        target_commitish: 'main',
        name: versionTag,
        body: '',
        draft: false,
        prerelease: false,
        generate_release_notes: false,
    })

    return release.data.upload_url
}

void (async function () {
    const status = await simpleGit().status()

    if (status.modified.length) {
        // return console.error('У вас есть незафиксированные изменения. Сначала сделайте git commit')
    }

    // Получаем package.json файл и ссылку на репу гитхаба
    const myPackage = getPackageFile()
    const githubLink = getGithubLinkFromPackage(myPackage)
    console.log('Github repo %s/%s', githubLink.owner, githubLink.repo)

    // Получаем текущую версию, обновляем её и записываем в package.json
    const symVer = getSymVerFromPackage(myPackage)
    symVer.newMinor()
    const versionTag = `v${symVer.version}`
    writeVersionToPackage(symVer.version)
    console.log('New version %s', symVer.version)

    // Коммитим изменение package.json, создаём тэг и пушим
    await simpleGit().add('package.json').commit(versionTag)
    try {
        await simpleGit().addTag(versionTag)
    } catch (error) {
        if (error.message.includes('already exists')) {
            return console.error('Тэг %s уже существует. Измените версию в package.json и попробуйте снова', versionTag)
        }

        throw error
    }
    await simpleGit().push()
    console.log('Commited and pushed new version with tag %s', versionTag)

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

    // Создаём релиз
    const uploadUrl = await createRelease(octokit, { ...githubLink, versionTag })
    console.log('Create release for version v%s', symVer.version)

    // Создаём архив релиза и загружаем в релиз
    const archiveFilePath = await zipBuildFolder()
    const archiveFile = readFileSync(archiveFilePath)
    await uploadBuildZIP(octokit, { archiveFile, uploadUrl })
})()
