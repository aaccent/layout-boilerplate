import { join } from 'path'
import archiver from 'archiver'
import { createWriteStream, mkdirSync, renameSync, rmSync } from 'fs'
import { getPackageFile, TEMP_FOLDER_PATH } from './general.js'
import { ROOT_PATHS } from '../../webpack/paths.js'

export function generateArchiveNameFromPackage() {
    const myPackage = getPackageFile()
    const packageName = myPackage.name.replace(/_.*/, '')
    return `${packageName}-build_v${myPackage.version}.zip`
}

function removeFolderSync(path) {
    try {
        rmSync(path, { recursive: true, force: true })
    } catch (err) {
        if (err.code === 'ENOENT') return
        throw err
    }
}

function moveFile(file, destination) {
    renameSync(file, destination)
}

/** @return {Promise<{ archiveFileName: string; archiveFilePath: string }>} - Путь к созданному архиву и его название */
export function zipBuildFolder() {
    const { resolve, promise } = Promise.withResolvers()

    const archiveFileName = generateArchiveNameFromPackage()
    const tempArchiveFilePath = join(TEMP_FOLDER_PATH, archiveFileName)

    removeFolderSync(TEMP_FOLDER_PATH)
    mkdirSync(TEMP_FOLDER_PATH)

    const zip = archiver('zip', { zlib: { level: 9 } })

    const zipFile = createWriteStream(tempArchiveFilePath)
    zipFile.on('close', () => {
        console.log('Zipped %d kilobytes', zip.pointer() / 1000)

        const archiveFilePath = join(ROOT_PATHS.BUILD, archiveFileName)
        moveFile(tempArchiveFilePath, archiveFilePath)
        removeFolderSync(TEMP_FOLDER_PATH)

        console.log('Archive %s in folder %s', archiveFileName, ROOT_PATHS.BUILD)
        resolve({ archiveFilePath, archiveFileName })
    })

    zip.pipe(zipFile)
    zip.directory(ROOT_PATHS.BUILD, false)
    zip.finalize()

    return promise
}
