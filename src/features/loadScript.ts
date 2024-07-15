export type ScriptTypes = 'yaMap' | 'gMap' | 'ytApi' | string
export type ScriptStatus = 'downloading' | 'downloaded' | 'ready' | string

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

export function waitScriptStatus(type: ScriptTypes, status: ScriptStatus) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (window.globalScripts[type] !== status) return

            resolve(true)
            clearInterval(interval)
        }, 50)
    })
}
