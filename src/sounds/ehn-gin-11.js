const { emptyData, numberStream, twelveTone, writeData } = require("../tools");
const { frames, data } = emptyData(240);
const { SAMPLE_RATE, SAMPLE_RADIAN } = require("../constants");

const freqs = twelveTone(200);
const offset = Math.floor(5 * SAMPLE_RATE);
const numbers = numberStream(1, 7121984, 5);
let freqPos = 0;
let flop = false;

for (let loop = 0; loop < 2; loop++) {
  let pos = 0;
  while (pos < frames) {
    const length = numbers();
    const writes = 1 + Math.floor((frames - length - length - pos) / offset);
    for (let index = 0; index < length; index++) {
      const val = Math.sin(SAMPLE_RADIAN * index * freqs[freqPos]);
      const scale = Math.sin((Math.PI * index) / length);
      const scale0 = (flop ? 0.17 : 0.19) * scale;
      const scale1 = (flop ? 0.19 : 0.17) * scale;
      for (let write = 0; write < writes; write++) {
        const writeAt = pos + index + write * offset;
        data[0][writeAt] = (1.0 - scale0) * data[0][writeAt] + scale0 * val;
        data[1][writeAt] = (1.0 - scale1) * data[1][writeAt] + scale1 * val;
        data[0][writeAt + length] *= 1.0 - scale0 * val;
        data[1][writeAt + length] *= 1.0 - scale1 * val;
      }
    }
    freqPos = (freqPos + numbers()) % freqs.length;
    pos += numbers();
    pos += offset;
    flop = !flop;
  }
  data[0].reverse();
  data[1].reverse();
}

writeData(data, __filename);
