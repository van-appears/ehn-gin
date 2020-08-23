const { emptyData, numberStream, writeData } = require("../tools");
const { frames, data } = emptyData(240);
const { TWO_PI } = require("../constants");

let ratioPos = 0;
const number = numberStream(1, 16071988);
const ratios = [1, 2, 3, 4, 5, 6, 7, 10, 12, 14, 15, 20, 21];
const settings = [
  { groups: 6, length: 630 },
  { groups: 6, length: 631 }
];

settings.forEach(({ groups, length }) => {
  for (let channel = 0; channel < 2; channel++) {
    const loop = new Array(length).fill(0);
    let pos = 0;
    while (pos < frames) {
      const scale = (0.4 + pos / frames) / 2;
      ratioPos = (ratioPos + number()) % ratios.length;
      for (let group = 0; group < groups; group++) {
        for (let index = 0; index < length; index++) {
          if (index % groups === group) {
            const val = Math.sin((ratios[ratioPos] * index * TWO_PI) / length);
            const mixRatio = 0.2 - (0.199 * pos) / frames;
            loop[index] = (1.0 - mixRatio) * loop[index] + mixRatio * val;
          }
          if (pos < frames) {
            data[channel][pos++] += scale * loop[index];
          }
        }
      }
    }
  }
});

writeData(data, __filename);
