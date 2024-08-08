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

function parseCLIArgs() {
    const rawArgs = process.argv.slice(2)
    const parsedArgs = rawArgs
        .map((arg) => arg.replace('--', '').split('='))
        .map(([name, value]) => [name, value || '1'])

    return Object.fromEntries(parsedArgs)
}

/**
 * Проверяет доступ владельца `owner` к репозиторию `repo` на права записи
 * @param {Octokit} octokit - Сессия гитхаба
 * @param {string} owner - Владелец репозитория
 * @param {string} repo - Название репозитория
 * @return {Promise<boolean>} - `true` если у пользователя есть права записи, иначе `false`
 */
async function isHaveAccessToRepo(octokit, { owner, repo }) {
    try {
        const res = await octokit.request('GET /repos/{owner}/{repo}', {
            owner,
            repo,
        })

        return res.data.permissions.push
    } catch (error) {
        if (error.status === 404) {
            throw new Error(`Репозитория ${owner}/${repo} не существует или вы не имеете к нему доступ`)
        }
    }
}

/**
 * Отправляет `archiveFile` в гитхаб релиз по ссылке `uploadUrl`
 * @param {Octokit} octokit - Сессия гитхаба
 * @param {string} uploadUrl - Ссылка на гитхаб upload для загрузки файла `archiveFile`
 * @param {Buffer} archiveFile - Бинарный код файла, который будет загружен по `uploadUrl`
 * @param {string} fileName - Название файла
 * @return {Promise<void>}
 */
async function uploadBuildZIP(octokit, { uploadUrl, archiveFile, fileName }) {
    await octokit.request({
        method: 'POST',
        url: uploadUrl,
        headers: {
            'content-type': 'application/zip',
        },
        data: archiveFile,
        name: fileName,
    })

    console.log('Uploaded build archive %s to release', fileName)
}

/**
 * Создаёт релиз с названием и тэгом `versionTag` в
 * репозитории `repo` владельца `owner`
 * @param {Octokit} octokit - Сессия гитхаба
 * @param {string} owner - Владелец репозитория
 * @param {string} repo - Название репозитория
 * @param {`v${string}`} versionTag - Текст для тэга и названия релиза
 * @return {Promise<string>} - Ссылку для загрузки файлов в релиз
 */
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
    if (!process.env.GITHUB_TOKEN) {
        throw new Error(
            'Необходимо указать гитхаб токен в env переменной GITHUB_TOKEN. Это можно сделать через cli или в файле .env.local. Ни в коем случае не указывайте токен в .env',
        )
    }

    const status = await simpleGit().status()

    if (status.modified.length) {
        return console.error('У вас есть незафиксированные изменения. Сначала сделайте git commit')
    }

    // Получаем package.json файл и ссылку на репу гитхаба
    const myPackage = getPackageFile()
    const githubLink = getGithubLinkFromPackage(myPackage)
    console.log('Github repo %s/%s', githubLink.owner, githubLink.repo)

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

    const haveWriteAccess = await isHaveAccessToRepo(octokit, { ...githubLink })
    if (!haveWriteAccess) {
        return console.error('У вас нет прав на создание релизов в репозитории')
    }

    // Получаем текущую версию
    const symVer = getSymVerFromPackage(myPackage)

    // Выставляем новую версию
    const cliArgs = parseCLIArgs()
    if (!cliArgs.major && !cliArgs.minor && !cliArgs.patch) {
        return console.error(
            'Необходимо выбрать тип версии:\n',
            'pnpm run release -- --major\n',
            'pnpm run release -- --minor\n',
            'pnpm run release -- --patch\n',
        )
    }

    if (cliArgs.major) symVer.newMajor()
    else if (cliArgs.minor) symVer.newMinor()
    else if (cliArgs.patch) symVer.newPatch()

    /** @type {`v${string}`} */
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

    // Создаём релиз
    const uploadUrl = await createRelease(octokit, { ...githubLink, versionTag })
    console.log('Create release for version v%s', symVer.version)

    // Создаём архив релиза и загружаем в релиз
    const { archiveFilePath, archiveFileName } = await zipBuildFolder()
    const archiveFile = readFileSync(archiveFilePath)
    await uploadBuildZIP(octokit, { archiveFile, uploadUrl, fileName: archiveFileName })
})()
