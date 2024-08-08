import { readFileSync } from 'fs'
import { join } from 'path'

export const PACKAGE_FILE_PATH = join(process.cwd(), 'package.json')

export function getPackageFile() {
    const rawPackageFile = readFileSync(PACKAGE_FILE_PATH).toString()
    return JSON.parse(rawPackageFile)
}

export const TEMP_FOLDER_PATH = join(process.cwd(), '_temp')
