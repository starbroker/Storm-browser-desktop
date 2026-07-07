import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Ensure build directory exists
const buildDir = path.resolve('build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// 2. Custom Sleek SVG Logo for Storm Browser (512x512)
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0c10" />
      <stop offset="50%" stop-color="#111622" />
      <stop offset="100%" stop-color="#07080c" />
    </linearGradient>
    <linearGradient id="stormGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00d2ff" />
      <stop offset="50%" stop-color="#0066ff" />
      <stop offset="100%" stop-color="#7f00ff" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="120" fill="url(#bgGrad)" stroke="#1e293b" stroke-width="6" />
  <path d="M120,380 C200,480 400,420 420,280 C440,140 280,80 200,160" fill="none" stroke="url(#stormGrad)" stroke-width="12" opacity="0.15" stroke-dasharray="10 15" />
  <g filter="url(#glow)">
    <path d="M 360 170 C 320 120, 190 110, 180 190 C 170 270, 340 250, 330 330 C 320 410, 190 400, 150 350" fill="none" stroke="url(#stormGrad)" stroke-width="54" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>
`;

// 3. Custom Sidebar SVG matching Storm Browser dark/blue theme (164x314)
const sidebarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 164 314" width="164" height="314">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#05070a" />
      <stop offset="50%" stop-color="#0b101d" />
      <stop offset="100%" stop-color="#040508" />
    </linearGradient>
    <linearGradient id="stormGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00d2ff" />
      <stop offset="100%" stop-color="#7f00ff" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="164" height="314" fill="url(#bgGrad)" />
  <path d="M-10,314 C40,250 80,180 30,120 C-10,70 10,20 0,0" fill="none" stroke="url(#stormGrad)" stroke-width="4" opacity="0.25" />
  <circle cx="100" cy="50" r="80" fill="url(#stormGrad)" opacity="0.08" filter="url(#glow)" />
  <g transform="translate(39, 45) scale(0.12)" filter="url(#glow)">
    <path d="M 360 170 C 320 120, 190 110, 180 190 C 170 270, 340 250, 330 330 C 320 410, 190 400, 150 350" fill="none" stroke="url(#stormGrad)" stroke-width="54" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <text x="69" y="145" font-family="sans-serif" font-size="11" font-weight="900" fill="#ffffff" letter-spacing="2" text-anchor="middle">STORM</text>
  <text x="69" y="160" font-family="sans-serif" font-size="8" font-weight="600" fill="#00d2ff" letter-spacing="1" text-anchor="middle">BROWSER</text>
  <line x1="30" y1="270" x2="108" y2="270" stroke="#1e293b" stroke-width="1" />
  <text x="69" y="285" font-family="sans-serif" font-size="6" font-weight="bold" fill="#475569" text-anchor="middle" letter-spacing="1">SETUP WIZARD</text>
</svg>
`;

// 4. Custom Header SVG (150x57)
const headerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 57" width="150" height="57">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#05070a" />
      <stop offset="100%" stop-color="#0d1424" />
    </linearGradient>
    <linearGradient id="stormGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d2ff" />
      <stop offset="100%" stop-color="#7f00ff" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="150" height="57" fill="url(#bgGrad)" />
  <g transform="translate(105, 8) scale(0.08)" filter="url(#glow)">
    <path d="M 360 170 C 320 120, 190 110, 180 190 C 170 270, 340 250, 330 330 C 320 410, 190 400, 150 350" fill="none" stroke="url(#stormGrad)" stroke-width="54" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <text x="15" y="27" font-family="sans-serif" font-size="10" font-weight="900" fill="#ffffff" letter-spacing="1">STORM</text>
  <text x="15" y="39" font-family="sans-serif" font-size="8" font-weight="600" fill="#00d2ff">BROWSER</text>
</svg>
`;

// 5. BMP Encoder Helper
function encodeBMP(width, height, rawRGBBuffer) {
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelDataSize = rowSize * height;
  const fileSize = 54 + pixelDataSize;

  const buffer = Buffer.alloc(fileSize);

  // BMP File Header
  buffer.write('BM', 0, 2);
  buffer.writeUInt32LE(fileSize, 2);
  buffer.writeUInt32LE(0, 6);
  buffer.writeUInt32LE(54, 10);

  // DIB Header
  buffer.writeUInt32LE(40, 14);
  buffer.writeInt32LE(width, 18);
  buffer.writeInt32LE(-height, 22); // Top-down
  buffer.writeUInt16LE(1, 26);
  buffer.writeUInt16LE(24, 28);
  buffer.writeUInt32LE(0, 30);
  buffer.writeUInt32LE(pixelDataSize, 34);
  buffer.writeInt32LE(2835, 38);
  buffer.writeInt32LE(2835, 42);
  buffer.writeUInt32LE(0, 46);
  buffer.writeUInt32LE(0, 50);

  // Pixel data
  let offset = 54;
  for (let y = 0; y < height; y++) {
    const rowStart = y * width * 3;
    let bytesWritten = 0;
    for (let x = 0; x < width; x++) {
      const r = rawRGBBuffer[rowStart + x * 3];
      const g = rawRGBBuffer[rowStart + x * 3 + 1];
      const b = rawRGBBuffer[rowStart + x * 3 + 2];

      buffer[offset++] = b;
      buffer[offset++] = g;
      buffer[offset++] = r;
      bytesWritten += 3;
    }
    while (bytesWritten < rowSize) {
      buffer[offset++] = 0;
      bytesWritten++;
    }
  }

  return buffer;
}

// 6. Main execution function
async function main() {
  try {
    console.log('Generating premium assets for Storm Browser...');

    // A. Generate high-resolution icon.png
    console.log('- Generating build/icon.png...');
    await sharp(Buffer.from(logoSvg))
      .resize(512, 512)
      .png()
      .toFile(path.join(buildDir, 'icon.png'));

    // B. Generate installerSidebar.bmp
    console.log('- Generating build/installerSidebar.bmp...');
    const sidebarRaw = await sharp(Buffer.from(sidebarSvg))
      .resize(164, 314)
      .ensureAlpha(1)
      .raw()
      .toBuffer();
    
    // Extract RGB from RGBA
    const sidebarRGB = Buffer.alloc(164 * 314 * 3);
    for (let i = 0; i < 164 * 314; i++) {
      sidebarRGB[i * 3] = sidebarRaw[i * 4];
      sidebarRGB[i * 3 + 1] = sidebarRaw[i * 4 + 1];
      sidebarRGB[i * 3 + 2] = sidebarRaw[i * 4 + 2];
    }
    const sidebarBmp = encodeBMP(164, 314, sidebarRGB);
    fs.writeFileSync(path.join(buildDir, 'installerSidebar.bmp'), sidebarBmp);

    // C. Generate installerHeader.bmp
    console.log('- Generating build/installerHeader.bmp...');
    const headerRaw = await sharp(Buffer.from(headerSvg))
      .resize(150, 57)
      .ensureAlpha(1)
      .raw()
      .toBuffer();

    const headerRGB = Buffer.alloc(150 * 57 * 3);
    for (let i = 0; i < 150 * 57; i++) {
      headerRGB[i * 3] = headerRaw[i * 4];
      headerRGB[i * 3 + 1] = headerRaw[i * 4 + 1];
      headerRGB[i * 3 + 2] = headerRaw[i * 4 + 2];
    }
    const headerBmp = encodeBMP(150, 57, headerRGB);
    fs.writeFileSync(path.join(buildDir, 'installerHeader.bmp'), headerBmp);

    console.log('Successfully generated all customized visual installer assets!');
  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
}

main();
