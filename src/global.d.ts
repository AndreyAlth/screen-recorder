export {}

declare global {
    interface Window {
        menu: {
            capture: () => void
            hide: () => void
            cancel: () => void
        }
    }
}
