// Assembles a portable Windows build of the app without relying on
// electron-builder/electron-packager's own network download step (both were
// unreliable in this environment). Requires node_modules/electron/dist to
// already be populated (run `npm install` first, or re-extract electron's
// zip from %LOCALAPPDATA%\electron\Cache if dist/ is empty).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const electronDist = path.join(root, 'node_modules', 'electron', 'dist');
const outDir = path.join(root, 'release', 'win-unpacked');
const appName = 'FAAN CBT Practice';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function main() {
  if (!fs.existsSync(path.join(electronDist, 'electron.exe'))) {
    console.error(
      'node_modules/electron/dist/electron.exe not found. Run `npm install` ' +
        '(or re-extract the electron zip from %LOCALAPPDATA%\\electron\\Cache) first.',
    );
    process.exit(1);
  }
  if (!fs.existsSync(path.join(root, 'dist', 'index.html'))) {
    console.error('dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  fs.rmSync(path.join(root, 'release'), { recursive: true, force: true });
  copyDir(electronDist, outDir);
  fs.renameSync(path.join(outDir, 'electron.exe'), path.join(outDir, `${appName}.exe`));

  const appDir = path.join(outDir, 'resources', 'app');
  copyDir(path.join(root, 'dist'), path.join(appDir, 'dist'));
  fs.mkdirSync(path.join(appDir, 'electron'), { recursive: true });
  fs.copyFileSync(
    path.join(root, 'electron', 'main.cjs'),
    path.join(appDir, 'electron', 'main.cjs'),
  );

  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
  fs.writeFileSync(
    path.join(appDir, 'package.json'),
    JSON.stringify({ name: pkg.name, version: pkg.version, main: pkg.main }, null, 2),
  );

  for (const file of ['Create Shortcuts.ps1', 'Create Shortcuts.bat', 'Read Me First.txt']) {
    fs.copyFileSync(path.join(__dirname, file), path.join(outDir, file));
  }

  console.log(`Packaged to ${outDir}`);
}

main();
