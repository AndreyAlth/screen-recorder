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
    window.menu.hide()
})

cancel?.addEventListener('click', () => {
    window.menu.cancel()
})

// ============================================
// Capture bottons
// ============================================

capture?.addEventListener('click', () => {
    window.appState.getSourceType().then((sourceType) => {
        window.screenAPI.captureSource(sourceType)
    })
})



screenbtn?.addEventListener('click', () => {
    window.appState.setSourceType('screen')
})

windowbtn?.addEventListener('click', () => {
    window.appState.setSourceType('window')
})

selectionbtn?.addEventListener('click', () => {
    window.appState.setSourceType('section')
})

//show images
window.files.setFiles((sources: ScreenSource[]) => {
    console.log(sources)
    const filesDiv = document.getElementById('files')
    if (!filesDiv) return
    
    // Clear previous content
    filesDiv.innerHTML = ''

    // Set up grid layout on container
    filesDiv.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: flex-start;
    `

    // Determine item width based on number of sources
    const itemWidth = sources.length === 1 ? '40%' : 'calc(33.333% - 7px)'

    // Create a canvas for each source
    sources.forEach((source) => {
        // Create container for each source
        const sourceContainer = document.createElement('div')
        sourceContainer.className = 'source-item'
        sourceContainer.style.cssText = `
            position: relative;
            width: ${itemWidth};
            box-sizing: border-box;
            text-align: center;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 8px;
            padding: 8px;
            transition: border-color 0.2s;
        `
        
        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.style.cssText = `
            width: 100%;
            height: auto;
            border-radius: 4px;
            display: block;
        `
        
        // Create label
        const label = document.createElement('div')
        label.textContent = source.name
        label.style.cssText = `
            margin-top: 8px;
            font-size: 12px;
            color: #b7bac4;
        `
        
        // Create save button
        const saveBtn = document.createElement('button')
        saveBtn.textContent = 'save'
        saveBtn.style.cssText = `
            position: absolute;
            bottom: 35px;
            right: 12px;
            background-color: #4f46e5;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 0.5rem;
            font-size: 11px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s, background-color 0.2s;
        `
        
        // Load image and draw to canvas
        const img = new Image()
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(img, 0, 0)
            }
        }
        img.src = source.thumbnail
        
        // Save button click handler
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            const dataUrl = canvas.toDataURL('image/png')
            window.screenAPI.saveScreenshot(source.name, dataUrl).then((path) => {
                if (path) {
                    // Play screenshot sound
                    const audio = new Audio('./public/screenshot-sound.mp3')
                    audio.play()

                    // Screenshot flash effect
                    const flash = document.createElement('div')
                    flash.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: white;
                        opacity: 0.8;
                        border-radius: 8px;
                        pointer-events: none;
                        animation: flashFade 0.3s ease-out forwards;
                    `
                    sourceContainer.appendChild(flash)
                    setTimeout(() => flash.remove(), 300)

                    saveBtn.textContent = 'saved'
                    saveBtn.style.backgroundColor = '#4c4f57'
                    saveBtn.style.cursor = 'default'
                    saveBtn.disabled = true
                    
                }
            })
        })
        
        // Hover effect for save button
        saveBtn.addEventListener('mouseenter', () => {
            if (!saveBtn.disabled) {
                saveBtn.style.backgroundColor = '#6366f1'
            }
        })
        saveBtn.addEventListener('mouseleave', () => {
            if (!saveBtn.disabled) {
                saveBtn.style.backgroundColor = '#4f46e5'
            }
        })
        
        // Add hover effect
        sourceContainer.addEventListener('mouseenter', () => {
            sourceContainer.style.borderColor = '#6366f1'
            saveBtn.style.opacity = '1'
        })
        sourceContainer.addEventListener('mouseleave', () => {
            sourceContainer.style.borderColor = 'transparent'
            saveBtn.style.opacity = '0'
        })
        
        // Append elements
        sourceContainer.appendChild(canvas)
        sourceContainer.appendChild(label)
        sourceContainer.appendChild(saveBtn)
        filesDiv.appendChild(sourceContainer)
    })
})

window.pathsAPI.getPaths().then((paths) => {
    const pathSelect = document.getElementById('pathSelect')
    if (!pathSelect) return
    pathSelect.innerHTML = ''
    paths.forEach((path) => {
        const option = document.createElement('option')
        // option.value = path.id
        // option.textContent = path.namePath
        pathSelect.appendChild(option)
    })
})  

