import fs from 'fs'
import path from 'node:path'

function getDirItems(dir) {
    return fs.readdirSync(dir)
}

export function isDirectory(path) {
    return fs.lstatSync(path).isDirectory()
}

const pathStartRegexp = new RegExp('((\\./)|([A-Z]:))')

function convertPaths(arrPaths) {
    return arrPaths.map((path) => {
        let result = path
        result = result.replaceAll('\\', '/')

        if (pathStartRegexp.test(result)) return result

        return './' + result
    })
}

/**
 * @param {string[]} paths
 * @param {string} ext
 * @param {boolean} subFolders
 * @return {string[]}
 * */
export function getFilesWithExt(paths, ext, subFolders = false) {
    const result = []
    paths.forEach((p) => {
        const regex = new RegExp(`\\.${ext}$`)
        const arrItems = getDirItems(p)

        arrItems.forEach((fileName) => {
            const itemPath = path.join(p, fileName)

            if (isDirectory(itemPath)) {
                subFolders && result.push(...getFilesWithExt([itemPath], ext))
                return
            }

            if (regex.test(fileName)) result.push(itemPath)
        })
    })

    return convertPaths(result)
}
