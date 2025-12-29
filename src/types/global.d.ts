export {}

interface ScreenAPI {
    getSources: () => Promise<ScreenSource[]>;
    captureSource: (sourceId: string) => Promise<string>;
    saveScreenshot: (dataUrl: string, defaultPath?: string) => Promise<string | null>;
    getScreenSize: () => Promise<{ width: number; height: number; scaleFactor: number }>;
}

interface SelectionAPI {
    onSetScreenshot: (callback: (data: { dataUrl: string; scaleFactor: number }) => void) => void;
    completeSelection: (region: {
      x: number;
      y: number;
      width: number;
      height: number;
      screenshotDataUrl: string;
      scaleFactor: number;
    }) => Promise<string | null>;
    cancelSelection: () => Promise<void>;
}

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
        files: {
            setFiles: (callback: (sources: ScreenSource[]) => void) => void
        },
        selectionAPI: SelectionAPI
    }
}
