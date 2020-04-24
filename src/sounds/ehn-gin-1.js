const { emptyData, pow, writeData } = require("../tools");
const { TWO_PI, SAMPLE_RATE } = require("../constants");
const { frames, data } = emptyData(240);
const { data: source } = emptyData(240);

let rad1 = 0;
let rad2 = 0;
let rad3 = 0;
let rad1diff = (0.061 * TWO_PI) / SAMPLE_RATE;
let rad2diff = (0.0073 * TWO_PI) / SAMPLE_RATE;
let rad3diff = (0.00087 * TWO_PI) / SAMPLE_RATE;

for (let channel = 0; channel < 2; channel++) {
  for (let index = 0; index < frames; index++) {
    rad1 = (rad1 + rad1diff) % TWO_PI;
    rad2 = (rad2 + rad2diff + rad1 / TWO_PI) % TWO_PI;
    rad3 = (rad3 + rad3diff + rad2 / TWO_PI) % TWO_PI;
    source[channel][index] = 0.08 * (rad3 / TWO_PI) - 0.04;
  }
}

const echo = (
  startPos,
  length,
  sustainFrames,
  wetStart,
  wetEnd
) => {
  startPos = Math.floor(startPos);
  length = Math.floor(length);

  for (let channel = 0; channel < 2; channel++) {
    let position = 0;
    let v2 = 0;
    let wet = 0;
    const echodata = new Array(sustainFrames).fill(0);

    for (let index = 0; index < length + 441000; index++) {
      const srcVal = index > length ? 0 : source[channel][startPos + index];
      const decay = pow((9 + Math.sin(Math.PI * (startPos + index) / frames)) / 10, 0.5);
      echodata[position] = echodata[position] * 0.999 + srcVal;

      const before1 = echodata[(position + sustainFrames - 4) % sustainFrames];
      const before2 = echodata[(position + sustainFrames - 5) % sustainFrames];
      const before3 = echodata[(position + sustainFrames - 6) % sustainFrames];
      const before4 = (before1 + before3) / 2;
      echodata[(position + sustainFrames - 5) % sustainFrames] =
        before2 * decay + before4 * (1 - decay);

      const wet = wetStart + (wetEnd - wetStart) * (index / length);
      const echoVal = wet * echodata[position];
      position = (position + 1) % sustainFrames;
      data[channel][startPos + index] += echoVal;
    }
  }
};


const echoGroups = [
  [330, 220, 176, 147],
  [440, 330, 220, 147],
  [440, 220, 176, 147],
  [440, 330, 220, 176],
  [330, 220, 176, 147],
  [440, 330, 176, 147]
];
let flop = 0.1;
const sectionLength = (frames - 10 * SAMPLE_RATE) / echoGroups.length;
echoGroups.forEach((echoGroup, groupIndex) => {
  const startPos = groupIndex * sectionLength;
  echoGroup.forEach(echoLength => {
    echo(startPos, sectionLength, echoLength, 0.1, 0.1);
    echo(startPos, sectionLength, echoLength + 1, flop - 0.1, -flop);
    flop = 0.1 - flop;
  })
});

writeData(data, __filename);
