const fs = require("fs");
const path = require("path");
const { OUTPUT_DIR } = require("../constants");
const fileNameRegex = new RegExp(`.*${path.sep}(.*)\.js`);

function ensureOutputDirectory() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  return OUTPUT_DIR;
}

module.exports = (srcFilename, extension) => {
  const outputDir = ensureOutputDirectory();
  const nameWithoutExt = fileNameRegex.exec(srcFilename)[1];
  return path.join(outputDir, `${nameWithoutExt}${extension}`);
};
