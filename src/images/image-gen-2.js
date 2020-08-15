const fs = require("fs");
const PNG = require("pngjs").PNG;
const outPath = require("../tools/out-path");
const { IMAGE_SIZE } = require("../constants");

const width = IMAGE_SIZE;
const height = IMAGE_SIZE;
const nearEdge = 16;
const farEdge = IMAGE_SIZE - 17;

const characters = inputFile =>
  fs.readFileSync(inputFile, "utf8").toString().replace(" ", "");

const wrap = val =>
  val >= farEdge
    ? val - farEdge + nearEdge + 1
    : val <= nearEdge
    ? val - nearEdge + farEdge - 1
    : val;

const dataPos = (x, y) => (width * y + x) << 2;

const reduceBlock = (img, x, y, size) => {
  for (let xi = 0; xi < size; xi++) {
    for (let yi = 0; yi < size; yi++) {
      const xx = wrap(x + xi);
      const yy = wrap(y + yi);
      const idx = dataPos(xx, yy);
      const val = Math.max(img.data[idx] - 10, 0);
      img.data[idx] = val;
      img.data[idx + 1] = val;
      img.data[idx + 2] = val;
    }
  }
};

function generateImage(inputFile) {
  const chars = characters(inputFile);
  const img = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = dataPos(x, y);
      let col = 255;
      if (
        x >= nearEdge &&
        x <= farEdge &&
        y >= nearEdge &&
        y <= farEdge &&
        (x === nearEdge || x === farEdge || y === nearEdge || y === farEdge)
      ) {
        col = 0;
      }

      img.data[idx] = col;
      img.data[idx + 1] = col;
      img.data[idx + 2] = col;
      img.data[idx + 3] = 0xff;
    }
  }

  let currentSize = 150;
  let currentX = Math.floor((width - currentSize) / 2);
  let currentY = Math.floor((width - currentSize) / 2);
  for (let i = 0; i < chars.length; i++) {
    reduceBlock(img, currentX, currentY, currentSize);
    switch (chars.charCodeAt(i) % 6) {
      case 0:
        currentX = wrap(currentX + currentSize);
        break;
      case 1:
        currentX = wrap(currentX - currentSize);
        break;
      case 2:
        currentY = wrap(currentY + currentSize);
        break;
      case 3:
        currentY = wrap(currentY - currentSize);
        break;
      case 4:
        currentSize += 10;
        break;
      case 5:
        currentSize = Math.max(10, currentSize - 10);
        break;
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
