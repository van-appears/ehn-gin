const fs = require("fs");
const PNG = require("pngjs").PNG;
const outPath = require("../tools/out-path");
const { IMAGE_SIZE } = require("../constants");

const width = IMAGE_SIZE;
const height = IMAGE_SIZE;
const whiteChar = String.fromCharCode(256);
const space = 16;
const borderAt = space + 1;

const sourceLines = inputFile =>
  fs
    .readFileSync(inputFile, "utf8")
    .toString()
    .split("\n")
    .map(x => x.trim());

function paddedLines(inputFile) {
  const nonEmptyLines = sourceLines(inputFile).filter(x => x);
  const lineLengths = nonEmptyLines.map(x => x.length);
  const maxLineLength = Math.max.apply(null, lineLengths);
  return nonEmptyLines.map(x => {
    const paddingLength = Math.ceil(Math.sqrt((maxLineLength - x.length) / 2));
    const padding = new Array(paddingLength).fill(whiteChar).join("");
    return padding + x + padding;
  });
}

function generateImage(inputFile) {
  const lines = paddedLines(inputFile);
  const img = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let col;
      if (x < space || y < space || x >= width - space || y >= height - space) {
        col = 255;
      } else if (
        x < borderAt ||
        y < borderAt ||
        x >= width - borderAt ||
        y >= height - borderAt
      ) {
        col = 0;
      } else {
        const line =
          lines[Math.floor((lines.length * (x - 17)) / (width - 34))];
        const char = line.charCodeAt(
          Math.floor((line.length * (y - 17)) / (height - 34))
        );
        col = 255 - (char % 256);
      }

      const idx = (width * y + x) << 2;
      img.data[idx] = col;
      img.data[idx + 1] = col;
      img.data[idx + 2] = col;
      img.data[idx + 3] = 0xff;
    }
  }
  return img;
}

module.exports = (inputFile, callback) => {
  const imageFile = outPath(inputFile, ".png");
  generateImage(inputFile)
    .pack()
    .pipe(fs.createWriteStream(imageFile))
    .on("finish", callback);
};
