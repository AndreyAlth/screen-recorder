export {}

interface ScreenAPI {
    getSources: () => Promise<ScreenSource[]>;
    captureSource: (sourceId: string) => Promise<string>;
    saveScreenshot: (dataUrl: string, defaultPath?: string) => Promise<string | null>;
    getScreenSize: () => Promise<{ width: number; height: number; scaleFactor: number }>;
  }

type SourceType = 'screen' | 'window' | 'region'

declare global {
    interface Window {
        menu: {
            capture: () => void
            hide: () => void
            cancel: () => void
        }
        captureArea: {
            screen: () => void
            window: () => void
            section: () => void
        }
        appState: {
            setSourceType: (type: SourceType) => void
            getSourceType: () => Promise<SourceType>
        }
        screenAPI: ScreenAPI
    }
}
