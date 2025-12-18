const capture = document.getElementById('captureBtn')
const hide = document.getElementById('minimizeBtn')
const cancel = document.getElementById('closeBtn')
const screenbtn = document.getElementById('screen')
const windowbtn = document.getElementById('window')
const selectionbtn = document.getElementById('selection')


// ============================================
// Menu bottons
// ============================================

hide?.addEventListener('click', () => {
    console.log('Hide clicked')
    window.menu.hide()
})

cancel?.addEventListener('click', () => {
    console.log('Cancel clicked')
    window.menu.cancel()
})

// ============================================
// Capture bottons
// ============================================

capture?.addEventListener('click', () => {
    console.log('Capture clicked')
    window.screenAPI.captureSource('screen')
})



screenbtn?.addEventListener('click', () => {
    window.appState.setSourceType('screen')
})

windowbtn?.addEventListener('click', () => {
    window.appState.setSourceType('window')
})

selectionbtn?.addEventListener('click', () => {
    window.appState.setSourceType('region')
})


