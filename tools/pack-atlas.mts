// Packs every PNG of assets-src/sprites into the game atlas: npm run atlas
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { packAsync } from "free-tex-packer-core";
import type { PackerExporterType } from "free-tex-packer-core";

const SOURCE_DIR = "assets-src/sprites";
const OUTPUT_DIR = "public/assets/Spritesheet";
const TEXTURE_NAME = "gameSprites";

const fileNames: string[] = (await readdir(SOURCE_DIR))
  .filter((fileName) => fileName.endsWith(".png"))
  .sort();
const images = await Promise.all(
  fileNames.map(async (fileName) => ({
    path: fileName,
    contents: await readFile(path.join(SOURCE_DIR, fileName)),
  })),
);

const files = await packAsync(images, {
  textureName: TEXTURE_NAME,
  exporter: "Phaser3" as PackerExporterType,
  removeFileExtension: true,
  prependFolderName: false,
  allowRotation: false,
  allowTrim: false,
  padding: 2,
  width: 1024,
  height: 1024,
  powerOfTwo: false,
});

await mkdir(OUTPUT_DIR, { recursive: true });
for (const file of files) {
  await writeFile(path.join(OUTPUT_DIR, file.name), file.buffer);
}

console.log(
  `Packed ${images.length} sprites into ${OUTPUT_DIR}/${TEXTURE_NAME}.png`,
);
