const capture = document.getElementById('captureBtn')
const hide = document.getElementById('minimizeBtn')
const cancel = document.getElementById('closeBtn')
const screenbtn = document.getElementById('screen')
const windowbtn = document.getElementById('window')
const selectionbtn = document.getElementById('selection')

console.log(capture)
console.log(hide)
console.log(cancel)

capture?.addEventListener('click', () => {
    console.log('Capture clicked')
    window.menu.capture()
})

hide?.addEventListener('click', () => {
    console.log('Hide clicked')
    window.menu.hide()
})

cancel?.addEventListener('click', () => {
    console.log('Cancel clicked')
    window.menu.cancel()
})

screenbtn?.addEventListener('click', () => {
    console.log('Screen clicked')
    window.captureArea.screen()
})

windowbtn?.addEventListener('click', () => {
    console.log('Window clicked')
    window.captureArea.window()
})

selectionbtn?.addEventListener('click', () => {
    console.log('Selection clicked')
    window.captureArea.section()
})


