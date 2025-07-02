const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

const src = path.join(__dirname, 'public', 'log_vector.png');
const outDir = path.join(__dirname, 'public');

const icons = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-256x256.png', size: 256 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 }
];

(async () => {
  for (const icon of icons) {
    await sharp(src)
      .resize(icon.size, icon.size)
      .toFile(path.join(outDir, icon.name));
    console.log(`Generated ${icon.name}`);
  }

  // Favicon (multi-size PNGs)
  const favicon48 = path.join(outDir, 'favicon-48x48.png');
  const favicon32 = path.join(outDir, 'favicon-32x32.png');
  await sharp(src).resize(48, 48).toFile(favicon48);
  await sharp(src).resize(32, 32).toFile(favicon32);

  // Gera favicon.ico a partir dos PNGs
  const icoPath = path.join(__dirname, 'src', 'app', 'favicon.ico');
  const icoBuffer = await pngToIco([favicon32, favicon48]);
  fs.writeFileSync(icoPath, icoBuffer);

  console.log('All icons generated!');
})();
