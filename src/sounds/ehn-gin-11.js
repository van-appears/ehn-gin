const { emptyData, numberStream, writeData } = require("../tools");
const { frames, data } = emptyData(240);
const { TWO_PI } = require("../constants");

let ratioPos = 0;
const number = numberStream(1, 16071988);
const ratios = [1, 2, 3, 4, 5, 6, 7, 10, 12, 14, 15, 20, 21];
for (let channel = 0; channel < 2; channel++) {
  const loop = new Array(630).fill(0);
  let pos = 0;
  while (pos < frames) {
    const scale = pos / frames;
    ratioPos = (ratioPos + number()) % ratios.length;
    for (let group = 0; group < 10; group++) {
      for (let index = 0; index < loop.length; index++) {
        if (index % 10 === group) {
          const val = Math.sin(
            (ratios[ratioPos] * index * TWO_PI) / loop.length
          );
          const mixRatio = 0.4 - (0.399 * pos) / frames;
          loop[index] = (1.0 - mixRatio) * loop[index] + mixRatio * val;
        }
        data[channel][pos++] = scale * loop[index];
      }
    }
  }
}

writeData(data, __filename);
