import path from 'path'

export const FILE_NAMES = {
    MAIN_STYLES: 'style',
    MAIN_SCRIPTS: 'main',
}

export const FOLDER_NAMES = {
    SRC: 'src',
    BUILD: 'build',
    FONTS: 'fonts',
    IMG: 'media',
    STYLES: {
        BUILD: 'css',
        SRC: 'styles',
    },
    SCRIPTS: {
        BUILD: 'js',
        SRC: 'scripts',
    },
    LAYOUT: 'layout',
    ASSETS: 'assets',
    COMPONENTS: 'components',
    FEATURES: 'features',
    UI: 'ui',
    PAGES: 'pages',
    GLOBALS: 'globals',
}

export const ROOT_PATHS = {
    SRC: path.join(process.cwd(), FOLDER_NAMES.SRC),
    BUILD: path.join(process.cwd(), FOLDER_NAMES.BUILD),
}

export const PATHS = {
    SRC: {
        /** Path of 'src' folder */
        _: ROOT_PATHS.SRC,
        ASSETS: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.ASSETS),
        FONTS: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.ASSETS, FOLDER_NAMES.FONTS),
        GLOBALS: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.GLOBALS),
        COMPONENTS: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.COMPONENTS),
        FEATURES: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.FEATURES),
        LAYOUT: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.LAYOUT),
        UI: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.UI),
        PAGES: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.PAGES),
        SCRIPTS: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.SCRIPTS.SRC),
        STYLES: path.join(ROOT_PATHS.SRC, FOLDER_NAMES.STYLES.SRC),
    },
    BUILD: {
        /** Path of 'dist' folder */
        _: ROOT_PATHS.BUILD,
        IMG: path.join(ROOT_PATHS.BUILD, FOLDER_NAMES.IMG),
        FONTS: path.join(ROOT_PATHS.BUILD, FOLDER_NAMES.FONTS),
        SCRIPTS: path.join(ROOT_PATHS.BUILD, FOLDER_NAMES.SCRIPTS.BUILD),
        STYLES: path.join(ROOT_PATHS.BUILD, FOLDER_NAMES.STYLES.BUILD),
    },
}
