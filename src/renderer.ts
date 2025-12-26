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
    window.appState.setSourceType('region')
})

//show images
window.files.setFiles((sources: ScreenSource[]) => {
    const filesDiv = document.getElementById('files')
    if (!filesDiv) return
    
    // Clear previous content
    filesDiv.innerHTML = ''
    
    // Create a canvas for each source
    sources.forEach((source) => {
        // Create container for each source
        const sourceContainer = document.createElement('div')
        sourceContainer.className = 'source-item'
        sourceContainer.style.cssText = `
            position: relative;
            display: inline-block;
            margin: 10px;
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
            width: 200px;
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
            color: #b0b0b0;
        `
        
        // Create save button
        const saveBtn = document.createElement('button')
        saveBtn.textContent = 'save'
        saveBtn.style.cssText = `
            position: absolute;
            bottom: 35px;
            right: 12px;
            background-color: #0c6d1a;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
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
            window.screenAPI.saveScreenshot(source.name, source.thumbnail.toDataURL()).then((path) => {
                if (path) {
                    console.log('Screenshot saved to:', path)
                }
            })
        })
        
        // Hover effect for save button
        saveBtn.addEventListener('mouseenter', () => {
            saveBtn.style.backgroundColor = '#4caf50'
        })
        saveBtn.addEventListener('mouseleave', () => {
            saveBtn.style.backgroundColor = '#0c6d1a'
        })
        
        // Add hover effect
        sourceContainer.addEventListener('mouseenter', () => {
            sourceContainer.style.borderColor = '#4caf50'
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

