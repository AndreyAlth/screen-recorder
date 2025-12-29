// ============================================
// SCREEN & WINDOW CAPTURE
// ============================================

async function showSourcePicker(): Promise<void> {
  const sources = await window.screenAPI.getSources();

  // Separate screens and windows
  const screens = sources.filter((s) => s.id.startsWith("screen:"));
  const windows = sources.filter((s) => s.id.startsWith("window:"));

  // Build picker UI
  const pickerHtml = `
      <div class="source-picker">
        <h3>Screens</h3>
        <div class="source-grid">
          ${screens
            .map(
              (s) => `
            <div class="source-item" data-id="${s.id}">
              <img src="${s.thumbnail}" alt="${s.name}">
              <span>${s.name}</span>
            </div>
          `
            )
            .join("")}
        </div>
        
        <h3>Windows</h3>
        <div class="source-grid">
          ${windows
            .map(
              (s) => `
            <div class="source-item" data-id="${s.id}">
              <img src="${s.thumbnail}" alt="${s.name}">
              <span>${s.name}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

  // Show picker (implement your own modal)
  document.getElementById("picker-container")!.innerHTML = pickerHtml;

  // Handle selection
  document.querySelectorAll(".source-item").forEach((item) => {
    item.addEventListener("click", async () => {
      const sourceId = item.getAttribute("data-id")!;
      await captureAndSave(sourceId);
    });
  });
}

async function captureAndSave(sourceId: string): Promise<void> {
  const dataUrl = await window.screenAPI.captureSource(sourceId);
  const savedPath = await window.screenAPI.saveScreenshot(dataUrl);

  if (savedPath) {
    console.log("Screenshot saved to:", savedPath);
  }
}

// ============================================
// REGION/SECTION CAPTURE
// ============================================

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

let selectionOverlay: HTMLDivElement | null = null;
let startPoint: { x: number; y: number } | null = null;

async function startRegionCapture(): Promise<void> {
  // First, capture the entire screen
  const sources = await window.screenAPI.getSources();
  const screenSource = sources.find((s) => s.id.startsWith("screen:"));

  if (!screenSource) {
    console.error("No screen source found");
    return;
  }

  const fullScreenshot = await window.screenAPI.captureSource(screenSource.id);

  // Create fullscreen overlay for region selection
  selectionOverlay = document.createElement("div");
  selectionOverlay.id = "region-selector";
  selectionOverlay.innerHTML = `
      <img src="${fullScreenshot}" class="screenshot-bg">
      <div class="selection-box"></div>
      <div class="instructions">Click and drag to select region. Press ESC to cancel.</div>
    `;
  document.body.appendChild(selectionOverlay);

  // Add selection handlers
  setupRegionSelection(fullScreenshot);
}

function setupRegionSelection(fullScreenshot: string): void {
  const overlay = document.getElementById("region-selector")!;
  const selectionBox = overlay.querySelector(
    ".selection-box"
  ) as HTMLDivElement;

  overlay.addEventListener("mousedown", (e) => {
    startPoint = { x: e.clientX, y: e.clientY };
    selectionBox.style.display = "block";
  });

  overlay.addEventListener("mousemove", (e) => {
    if (!startPoint) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const left = Math.min(startPoint.x, currentX);
    const top = Math.min(startPoint.y, currentY);
    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);

    selectionBox.style.left = `${left}px`;
    selectionBox.style.top = `${top}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
  });

  overlay.addEventListener("mouseup", async (e) => {
    if (!startPoint) return;

    const region: Region = {
      x: Math.min(startPoint.x, e.clientX),
      y: Math.min(startPoint.y, e.clientY),
      width: Math.abs(e.clientX - startPoint.x),
      height: Math.abs(e.clientY - startPoint.y),
    };

    // Crop the region from full screenshot
    const croppedDataUrl = await cropImage(fullScreenshot, region);

    // Clean up overlay
    overlay.remove();
    startPoint = null;

    // Save the cropped screenshot
    await window.screenAPI.saveScreenshot(croppedDataUrl);
  });

  // ESC to cancel
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && selectionOverlay) {
      selectionOverlay.remove();
      selectionOverlay = null;
      startPoint = null;
    }
  });
}

// Crop image using Canvas
async function cropImage(dataUrl: string, region: Region): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      // Account for device pixel ratio
      const dpr = window.devicePixelRatio || 1;

      canvas.width = region.width * dpr;
      canvas.height = region.height * dpr;

      ctx.drawImage(
        img,
        region.x * dpr, // Source X
        region.y * dpr, // Source Y
        region.width * dpr, // Source width
        region.height * dpr, // Source height
        0, // Dest X
        0, // Dest Y
        canvas.width, // Dest width
        canvas.height // Dest height
      );

      resolve(canvas.toDataURL("image/png"));
    };
    img.src = dataUrl;
  });
}
