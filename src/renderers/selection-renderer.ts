// DOM Elements
const screenshotBg = document.getElementById(
  "screenshot-bg"
) as HTMLImageElement;
const selectionBox = document.getElementById("selection-box") as HTMLDivElement;
const dimensions = document.getElementById("dimensions") as HTMLDivElement;
const instructions = document.getElementById("instructions") as HTMLDivElement;

// State
let screenshotDataUrl: string = "";
let scaleFactor: number = 1;
let isSelecting = false;
let startX = 0;
let startY = 0;

// ============================================
// Receive screenshot from main process
// ============================================
window.selectionAPI.onSetScreenshot((data) => {
    screenshotDataUrl = data.dataUrl;
    scaleFactor = data.scaleFactor;

    // screenshotBg.src = screenshotDataUrl;
});

// ============================================
// Mouse event handlers
// ============================================
document.addEventListener("mousedown", (e) => {
  isSelecting = true;
  startX = e.clientX;
  startY = e.clientY;

  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.width = "0px";
  selectionBox.style.height = "0px";
  selectionBox.style.display = "block";
  dimensions.style.display = "block";
  instructions.style.display = "none";
});

document.addEventListener("mousemove", (e) => {
  if (!isSelecting) return;

  const currentX = e.clientX;
  const currentY = e.clientY;

  // Calculate rectangle bounds
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  // Update selection box
  selectionBox.style.left = `${left}px`;
  selectionBox.style.top = `${top}px`;
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;

  // Update dimensions display
  dimensions.textContent = `${width} × ${height}`;
  dimensions.style.left = `${left}px`;
  dimensions.style.top = `${top - 25}px`;
});

document.addEventListener("mouseup", async (e) => {
  if (!isSelecting) return;
  isSelecting = false;

  const currentX = e.clientX;
  const currentY = e.clientY;

  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  // Minimum selection size check
  if (width < 10 || height < 10) {
    resetSelection();
    return;
  }

  // Send selection to main process
  await window.selectionAPI.completeSelection({
    x: left,
    y: top,
    width,
    height,
    screenshotDataUrl,
    scaleFactor
  });
});

// ============================================
// Keyboard handlers
// ============================================
document.addEventListener("keydown", async (e) => {
  if (e.key === "Escape") {
    await window.selectionAPI.cancelSelection();
  }
});

// ============================================
// Helper functions
// ============================================
function resetSelection() {
  selectionBox.style.display = 'none';
  dimensions.style.display = 'none';
  instructions.style.display = 'block';
}
