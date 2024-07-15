const files = require('./files.cjs')

module.exports = async (pathsArr) => {
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
