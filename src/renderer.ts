const capture = document.getElementById('captureBtn')
const hide = document.getElementById('minimizeBtn')
const cancel = document.getElementById('closeBtn')

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