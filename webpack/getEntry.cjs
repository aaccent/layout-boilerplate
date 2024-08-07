const files = require('./files.cjs')

/**
 * Находит все `pug` файл в папках и подпапках по путям `pathsArr`
 * @return Возвращает пути к найденным `pug` файлам
 */
module.exports = async (...pathsArr) => {
    const result = {}
    const ext = 'pug'

    const entries = files.getFilesWithExt(pathsArr, ext, true)

    for (const filepath of entries) {
        const filename = filepath.match(new RegExp(`/([\\w_-]+)\\.${ext}`))[1]
        const path = filepath.match(new RegExp(`/(src/[\\w_/-]+)/${filename}\\.${ext}`))[1]
        result[filename] = `./${path}/${filename}.${ext}`
    }

    return result
}
