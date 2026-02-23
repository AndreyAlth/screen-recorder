const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './src/public/icons/png/512x512.png'
  },
  rebuildConfig: {},
  makers: [
    // Windows: generates a Squirrel-based .exe installer
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'screen_recorder',                        // no spaces or special chars
        setupExe: 'ScreenRecorderSetup.exe',
        setupIcon: './src/public/icons/win/icon.ico',   // must be a .ico file
      },
    },
    // macOS: generates a .dmg disk image (only builds on macOS)
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        name: 'Screen Recorder',
        icon: './src/public/icons/mac/icon.icns',       // must be a .icns file
        format: 'ULFO',                                 // use 'UDZO' for smaller file size
      },
    },
    // Linux: .deb package
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './src/public/icons/png/512x512.png'
        }
      },
    },
    // Linux: .rpm package
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
