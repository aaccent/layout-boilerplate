import { InfoPopupProps } from 'components/popups/InfoPopup'
import { AjaxFetchProps } from 'features/ajax-fetch'
import { ScriptStatus, ScriptTypes } from 'features/loadScript'

declare global {
	interface Window {
		initMap: () => void,
		onYouTubeIframeAPIReady: () => void,
		openedSelector: null | HTMLElement,
		openInfoPopup: (title: string, text: string, props?: InfoPopupProps) => void
		openInfoError: () => void,
		ajaxFetch: (props: AjaxFetchProps) => Promise<void>
		globalScripts: {
			[key in ScriptTypes]?: ScriptStatus
		}
	}
}

export {}
