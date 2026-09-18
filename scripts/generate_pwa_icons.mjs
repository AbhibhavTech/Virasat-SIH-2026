import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, getPixel) {
  const bytesPerPixel = 4; // RGBA
  const rowSize = width * bytesPerPixel + 1; // +1 for filter byte 0
  const buffer = Buffer.alloc(rowSize * height);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    buffer[offset++] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      buffer[offset++] = r;
      buffer[offset++] = g;
      buffer[offset++] = b;
      buffer[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(buffer);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    for (let j = 0; j < 8; j++) {
      const mask = -(byte & 1);
      byte = (byte >>> 1) ^ (0xEDB88320 & mask);
    }
    crc = (crc >>> 8) ^ (byte ^ (crc & 0xFF));
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Brand Icon Generator: Warm rounded saffron square with monument temple silhouette and Ashoka navy / emerald accents
function renderVirasatIcon(size, isMaskable = false) {
  return createPNG(size, size, (x, y, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const padding = isMaskable ? 0.2 : 0.08;
    const innerRadius = (w / 2) * (1 - padding);

    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Corner rounding for standard icon
    if (!isMaskable) {
      const r = w * 0.22;
      const rx = Math.max(0, Math.abs(dx) - (w / 2 - r));
      const ry = Math.max(0, Math.abs(dy) - (h / 2 - r));
      if (Math.sqrt(rx * rx + ry * ry) > r) {
        return [0, 0, 0, 0]; // Transparent outside rounded corner
      }
    }

    // Tricolour subtle gradient background
    // Top 35%: Warm Saffron (#FF671F)
    // Middle 30%: Warm Cream (#FAF8F5)
    // Bottom 35%: India Green (#046A38)
    const relY = y / h;
    let bgR = 255, bgG = 103, bgB = 31; // #FF671F
    if (relY > 0.40 && relY < 0.60) {
      bgR = 250; bgG = 248; bgB = 245; // Cream
    } else if (relY >= 0.60) {
      bgR = 4; bgG = 106; bgB = 56; // #046A38
    } else if (relY > 0.32 && relY <= 0.40) {
      const t = (relY - 0.32) / 0.08;
      bgR = Math.round(255 * (1 - t) + 250 * t);
      bgG = Math.round(103 * (1 - t) + 248 * t);
      bgB = Math.round(31 * (1 - t) + 245 * t);
    } else if (relY >= 0.60 && relY < 0.68) {
      const t = (relY - 0.60) / 0.08;
      bgR = Math.round(250 * (1 - t) + 4 * t);
      bgG = Math.round(248 * (1 - t) + 106 * t);
      bgB = Math.round(245 * (1 - t) + 56 * t);
    }

    // Central Temple Dome / Heritage Arch Glyph in Navy/Dark Stone
    const glyphScale = isMaskable ? 0.38 : 0.46;
    const gx = (x - cx) / (w * glyphScale);
    const gy = (y - cy) / (h * glyphScale);

    // Monument shape: Dome + Arch + Base
    let isGlyph = false;
    // Base pillar
    if (Math.abs(gx) < 0.75 && gy > 0.2 && gy < 0.7) {
      // Hollow arch in center
      if (!(Math.abs(gx) < 0.45 && gy > 0.35 && gy < 0.7)) {
        isGlyph = true;
      }
    }
    // Dome
    if (gy <= 0.2 && gy > -0.5) {
      const domeR = 0.55;
      if (gx * gx + (gy + 0.1) * (gy + 0.1) < domeR * domeR) {
        isGlyph = true;
      }
    }
    // Spire
    if (Math.abs(gx) < 0.08 && gy <= -0.5 && gy > -0.85) {
      isGlyph = true;
    }

    if (isGlyph) {
      return [11, 25, 44, 255]; // Deep Heritage Navy #0B192C
    }

    return [bgR, bgG, bgB, 255];
  });
}

const icon192 = renderVirasatIcon(192, false);
fs.writeFileSync('./public/icon-192.png', icon192);

const icon512 = renderVirasatIcon(512, false);
fs.writeFileSync('./public/icon-512.png', icon512);

const iconMaskable = renderVirasatIcon(512, true);
fs.writeFileSync('./public/icon-maskable.png', iconMaskable);

console.log('Successfully generated PWA icons: icon-192.png, icon-512.png, icon-maskable.png');
