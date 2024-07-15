import { loadScript, waitScriptStatus } from '@/features/loadScript'

export async function loadYTApi() {
    await loadScript('https://www.youtube.com/iframe_api', 'ytApi')

    return waitScriptStatus('ytApi', 'ready')
}

window.onYouTubeIframeAPIReady = () => (window.globalScripts.ytApi = 'ready')
