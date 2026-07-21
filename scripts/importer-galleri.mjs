// Engangs-import: læser originaler fra _raw/galleri (uden for git),
// retter EXIF-rotation og genererer web-optimerede JPEG'er til assets/img/galleri.
// Kør:  node scripts/importer-galleri.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const KILDE = "_raw/galleri";
const MAAL = "assets/img/galleri";

// original → web-slug (jf. spec, tabellen "Endelig billedliste")
const BILLEDER = {
  "IMG_7009.JPG": "vintergaekker",
  "IMG_7062.JPG": "paaskeliljer-anemoner",
  "IMG_7113.JPG": "mirabelle-april",
  "IMG_7117.JPG": "mirabelle-blomster",
  "IMG_3508.JPG": "stade-aerenpris",
  "IMG_0264.JPG": "haven-maj",
  "2023-07-28-11-37-35-707.PNG": "ejendommen-fra-luften",
  "IMG_6583.JPG": "asters",
  "IMG_6152.JPG": "skovstade-juli",
  "IMG_5137.jpg": "magasiner-stablet",
  "IMG_5138.jpg": "tavler-skaeres",
  "IMG_5142.JPG": "honning-tappes",
  "IMG_5129.jpg": "tavleglas-bakke",
  "IMG_5133.jpg": "tavleglas-bord",
  "IMG_6755.JPG": "boegeskov-oktober",
  "IMG_6768.JPG": "stade-efteraar",
  "IMG_5420.JPG": "huset-efteraar",
};

await mkdir(MAAL, { recursive: true });
for (const [fil, slug] of Object.entries(BILLEDER)) {
  const ud = path.join(MAAL, `${slug}.jpg`);
  const info = await sharp(path.join(KILDE, fil))
    .rotate() // anvender EXIF-orientering og fjerner tagget
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(ud);
  console.log(`${fil} -> ${ud} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
}
console.log(`Færdig: ${Object.keys(BILLEDER).length} billeder.`);
