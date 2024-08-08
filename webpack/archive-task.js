import archiver from 'archiver'
import { join } from 'path'
import { createWriteStream, mkdirSync, rmSync, renameSync } from 'fs'
import { ROOT_PATHS } from './paths.js'
import myPackage from '../package.json' with { type: 'json' }

function generateArchiveName() {
    const packageName = myPackage.name.replace(/_.*/, '')
    return `${packageName}-build_v${myPackage.version}.zip`
}

const ARCHIVE_FILE_NAME = generateArchiveName()
const TEMP_FOLDER = join(process.cwd(), '_temp')
const ARCHIVE_FILE = join(TEMP_FOLDER, ARCHIVE_FILE_NAME)
const BUILD_FOLDER = join(ROOT_PATHS.BUILD)

function removeFolderSync(path) {
    try {
        rmSync(path, { recursive: true, force: true })
    } catch (err) {
        if (err.code === 'ENOENT') return
        throw err
    }
}

function createZipFile() {
    removeFolderSync(TEMP_FOLDER)
    mkdirSync(TEMP_FOLDER)
    return createWriteStream(ARCHIVE_FILE)
}

function moveFile(file, destination) {
    renameSync(file, destination)
}

const zipFile = createZipFile()
const zip = archiver('zip', { zlib: { level: 9 } })

zipFile.on('close', () => {
    console.log('Zipped %d kilobytes', zip.pointer() / 1000)

    const destination = join(BUILD_FOLDER, ARCHIVE_FILE_NAME)
    moveFile(ARCHIVE_FILE, destination)
    removeFolderSync(TEMP_FOLDER)

    console.log('Archive %s in folder %s', ARCHIVE_FILE_NAME, BUILD_FOLDER)
})

zip.pipe(zipFile)
zip.directory(BUILD_FOLDER, false)
zip.finalize()
