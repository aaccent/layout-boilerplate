export type ScriptTypes = 'yaMap' | 'gMap' | 'ytApi' | string
export type ScriptStatus = 'downloading' | 'downloaded' | 'ready' | string

/**
 * Вставляет `script` элемент в конце `body` со значением `src` в атрибуте `src`.
 * Если скрипт с `id` уже был загружен, то ничего не происходит.
 * @param src - Скрипт для загрузки
 * @param id - ID скрипта для избежания повторной загрузки
 * @param async - Добавить атрибут `async` на `script` элемент
 */
export async function loadScript(src: string, id: ScriptTypes, async = true): Promise<any> {
    if (!window.globalScripts) window.globalScripts = {}
    if (id in window.globalScripts && window.globalScripts[id] === 'downloaded') return

    window.globalScripts[id] = 'downloading'
    return new Promise((resolve, reject) => {
        const scriptEl = document.createElement('script')
        scriptEl.onload = resolve
        scriptEl.onerror = reject
        scriptEl.type = 'text/javascript'
        scriptEl.async = async
        scriptEl.src = src

        window.globalScripts[id] = 'downloaded'
        document.body.appendChild(scriptEl)
    })
}

const SCRIPT_STATUS_TIMEOUT = 50
const CANCEL_SCRIPT_STATUS = 10000

/**
 * Возвращает `Promise<true>`, если у скрипта `type` будет статус `status`.
 * Проверка статуса происходит каждые {@link SCRIPT_STATUS_TIMEOUT} мс.
 * Если через {@link CANCEL_SCRIPT_STATUS} мс ожидаемый статус не будет
 * достигнут, то вернется `Promise<false>`
 * @param type - особая строка или `id`, ранее переданный в {@link loadScript}
 * @param status - Ожидаемый статус
 */
export function waitScriptStatus(type: ScriptTypes, status: ScriptStatus) {
    return new Promise<boolean>((resolve, reject) => {
        let cancel = false

        setTimeout(() => {
            cancel = true
        }, CANCEL_SCRIPT_STATUS)

        const interval = setInterval(() => {
            if (cancel) {
                reject(false)
                return clearInterval(interval)
            }

            if (window.globalScripts[type] !== status) return

            resolve(true)
            clearInterval(interval)
        }, SCRIPT_STATUS_TIMEOUT)
    })
}
