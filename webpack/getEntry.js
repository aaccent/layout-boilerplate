import { getFilesWithExt } from './files.js'

/**
 * Находит все `pug` файл в папках и подпапках по путям `pathsArr`
 * @return Возвращает пути к найденным `pug` файлам
 */
export async function getEntry(...pathsArr) {
    const result = {}
    const ext = 'pug'

    const entries = getFilesWithExt(pathsArr, ext, true)

    for (const filepath of entries) {
        const filename = filepath.match(new RegExp(`/([\\w_-]+)\\.${ext}`))[1]
        const path = filepath.match(new RegExp(`/(src/[\\w_/-]+)/${filename}\\.${ext}`))[1]
        result[filename] = `./${path}/${filename}.${ext}`
    }

    return result
}
