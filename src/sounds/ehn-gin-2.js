const { emptyData, pow, rotatingArray, writeData } = require("../tools");
const { TWO_PI, SAMPLE_RATE } = require("../constants");
const { frames, data } = emptyData(240);

const lengths = [80, 90, 120, 135, 160, 180, 240, 270, 360, 405, 450, 480];
const sineLengthGroups = lengths.map((_, i) => {
  const group = lengths.map(x => x);
  group.splice(i, 1);
  return group;
});

sineLengthGroups.forEach((sineLengthGroup, groupIndex) => {
  let pos = 0;
  const offset = groupIndex / sineLengthGroups.length;
  const nextFreq = rotatingArray(sineLengthGroup);
  while (pos < frames) {
    const freq = nextFreq.current;
    nextFreq.move();
    for (let index = 0; index < freq; index++) {
      const val = Math.sin((TWO_PI * index) / freq);
      const scale = pos / frames;
      const exp =
        Math.sin(Math.PI * scale) * Math.sin(TWO_PI * (offset + scale));
      const leftExp = Math.pow(2.0, exp);
      const rightExp = Math.pow(2.0, -exp);
      const left = pow(val, leftExp) / 11;
      const right = pow(val, rightExp) / 11;
      if (pos < frames) {
        data[0][pos] += left;
        data[1][pos] += right;
        pos++;
      }
    }
  }
});

writeData(data, __filename);
