const fs = require("fs");
const wav = require("node-wav");
const outPath = require("./out-path");
const { SAMPLE_RATE, OUTPUT_DIR } = require("../constants");

module.exports = (data, srcFilename) => {
  const buffer = wav.encode(data, {
    sampleRate: SAMPLE_RATE,
    bitDepth: 16
  });
  fs.writeFileSync(outPath(srcFilename, ".wav"), buffer);
};
