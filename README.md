# Screen Recorder

A robust, Electron-based screenshot utility built with TypeScript. Capture your entire screen, specific application windows, or custom selected regions with ease.

## Features

*   **Multiple Capture Modes**:
    *   **Screen**: Capture everything on any of your connected displays.
    *   **Window**: Target specific application windows for clean captures without background clutter.
    *   **Section**: Use an interactive overlay to select and capture a precise region of your screen.
*   **Preview Gallery**: Instantly view thumbnails of available capture sources.
*   **One-Click Save**: Hover over any thumbnail in the gallery and click "Save" to export the image immediately.
*   **Visual & Audio Feedback**: Confirm captures with a satisfyng flash effect and shutter sound.
*   **Path Management**: Configure and switch between different save directories (e.g., Downloads, Pictures).
*   **Multi-Monitor Support**: Seamlessly handles multiple displays for both full-screen and region captures.

## Installation

Ensure you have Node.js installed on your system.

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd screen-recorder
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

### Development

To start the application in development mode:

```bash
npm start
``` 

This command compiles the TypeScript code and launches the Electron application.

### Building

To build the project files:

```bash
npm run build
```

The compiled output will be generated in the `dist` directory.

## How it Works

1.  **Select Mode**: Use the buttons in the UI to choose your capture target:
    *   **Screen**: Icon representing full desktop.
    *   **Window**: Icon representing a single app window.
    *   **Selection**: Icon representing a crop tool.
2.  **Capture**: Click the "Capture" button.
    *   For **Screen** and **Window** modes, a gallery of all available sources will appear.
    *   For **Selection** mode, an overlay will cover your screens. Click and drag to select the area you want to save.
3.  **Save**:
    *   Hover over the desired image in the gallery.
    *   Click the **Save** button that appears.
    *   The image will be saved to your configured directory (defaulting to your system's download-like folder) with a timestamped filename.

## Technologies Used

*   **[Electron](https://www.electronjs.org/)**: Framework for building cross-platform desktop apps.
*   **[TypeScript](https://www.typescriptlang.org/)**: Typed superset of JavaScript for safer and more maintainable code.
*   **[electron-store](https://github.com/sindresorhus/electron-store)**: Simple data persistence for saving user preferences (like save paths).

## License

This project is licensed under the ISC License.
