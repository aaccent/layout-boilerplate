# Набор для верстки сайтов

## Стек

Набор состоит из:

-   Webpack
-   Pug
-   TypeScript или JavaScript
-   SCSS
-   PostCSS
-   Prettier
-   pnpm

## Зависимости

В качестве пакета используется `pnpm` вместо `npm`.
Можно использовать и `npm`, но советую применить `pnpm`

## Процесс работы

Во время комита код автоматически форматируется через prettier.

Запуск режима разработки `pnpm run dev`

### Картинки

Все картинки с форматами `jpg`, `png`, `jpeg` и `webp` конвертируются в `webp` с качеством `90`.

Для вставки картинок в `pug` файле необходимо использовать `require()`:

```pug
.some-class
    img(require("assets/static/some-img.jpg"))
```

### Скрипты

Для импорта `js` скриптов нужно добавлять `.js` в конце. Для импорта `ts` не нужно ничего добавлять.

### Pug

#### Шаблон страницы

Присутствует шаблон страницы по пути `src/layout/page` с блоками:

-   `block head` - для вставки кода в `head` тэг
-   `block scripts` - для вставки кода в конец `body`
-   `block main` - для вставки кода в страницу

Шаблон можно использовать по короткой ссылке:

```pug
extends layout/page

block append main
    div
```

## Билд

Запуск компиляции и сборки - `pnpm run build`
После сборки результат будет расположен в папке `build`

### Скрипты и стили

Имеется главные файлы скриптов и стилей по путям:

-   Скрипты - `src/scripts/main.ts`
-   Стили - `src/styles/styles.scss`

Они всегда входят в результат сборки как `main.bundle.js` и `styles.css`

Скрипты и стили которые импортированы в `pug` файлы страниц компилируются в отдельные файлы со скриптами и стилями.

```pug
// src/pages/index/index.pug

extends layout/page

block append head
    link(href=require('./styles.scss'), rel='stylesheet')

block append main
    section.section

block append scripts
    script(src=require('./main.ts'))
```

На выводе получится структура

```
build/
├── css/
│   ├── index.styles.css
│   └── styles.css
├── js/
│   ├── index.bundle.js
│   └── main.bundle.js
└── index.html
```

Если блоки со скриптами убрать, то получится

```
build/
├── css/
│   └── styles.css
├── js/
│   └── main.bundle.js
└── index.html
```
