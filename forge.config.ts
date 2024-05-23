import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerWix } from '@electron-forge/maker-wix';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './src/assets/icons/desktop_icon',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32', 'linux', 'macos'],
      config: {}
    }
    // new MakerWix({
    //   icon: './src/assets/icons/desktop_icon.ico',
    //   language: 1033,
    //   ui: {
    //     chooseDirectory: true,
    //   },
    //   features: {
    //     autoLaunch: true,
    //     autoUpdate: true,
    //   },
    //   manufacturer: 'Accenture',
    //   description:
    //     'An Accenture application used to download proof of work location to receive a housing costs reimbursement through the Belgian Federal Mobility Budget',
    // }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'RaphaCH',
          name: 'fmb_front',
        },
        prerelease: true,
      },
    },
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy:
        "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
