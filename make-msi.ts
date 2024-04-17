import * as msi from 'electron-wix-msi';
import * as path from 'path';

// Step 1: Instantiate the MSICreator
const msiCreator = new msi.MSICreator({
  appDirectory: path.resolve('release/win-unpacked'), // result from electron-builder
  description:
    'An Accenture application used to download proof of work location to receive a housing costs reimbursement through the Belgian Federal Mobility Budget',
  exe: 'FMB Housing Costs - Proof of Work Location',
  name: 'FMB Housing Costs - Proof of Work Location',
  manufacturer: 'Accenture',
  version: '1.0.0',
  language: 1033,
  arch: 'x86',
  outputDirectory: path.resolve('release/msi/'),
  ui: {
    images: {
      background: './src/assets/images/installer_background.jpg',
      banner: './src/assets/images/installer_banner.jpg',
    },
  },
});

async function createMsi() {
  // Step 2: Create a .wxs template file
  await msiCreator.create();

  // Step 3: Compile the template to a .msi file
  await msiCreator.compile();
}
createMsi();
