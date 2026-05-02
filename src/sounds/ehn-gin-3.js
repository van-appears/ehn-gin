const { emptyData, pow, writeData } = require("../tools");
const { TWO_PI, SAMPLE_RATE } = require("../constants");

const thirdStretched = input => {
  const originalFrames = input[0].length;
  const stretchedFrames = Math.ceil((originalFrames * 3) / 2);
  const newdata = [new Array(stretchedFrames), new Array(stretchedFrames)];
  for (let channel = 0; channel < 2; channel++) {
    for (let index = 0; index < stretchedFrames; index++) {
      const readFrame = (index * 2) / 3;
      const before = input[channel][Math.floor(readFrame)];
      const after = input[channel][Math.ceil(readFrame)] || 0;
      const partial = readFrame - Math.floor(readFrame);
      newdata[channel][index] = before + partial * (after - before);
    }
  }
  return newdata;
};

const reverse = input => {
  const newdata = [[].concat(input[0]), [].concat(input[1])];
  newdata[0].reverse();
  newdata[1].reverse();
  return newdata;
};

const mix = (source1, source2) => {
  const length1 = source1[0].length;
  const length2 = source2[0].length;
  const newLength = Math.max(length1, length2);
  const newdata = [new Array(newLength).fill(0), new Array(newLength).fill(0)];
  for (let channel = 0; channel < 2; channel++) {
    for (let index = 0; index < newLength; index++) {
      newdata[channel][index] =
        (source1[channel][index] || 0) + (source2[channel][index] || 0);
    }
  }
  return newdata;
};

const initialLength = 24171;
let iteration = [new Array(initialLength), new Array(initialLength)];
for (let index = 0; index < initialLength; index++) {
  const scale = index / initialLength;
  const halfSine = Math.sin(Math.PI * scale);
  const freq = 8000 + 80 * halfSine;
  const val = Math.sin(freq * TWO_PI * scale);
  const shaped = pow(val, Math.pow(2, halfSine - 1));
  iteration[0][index] = 0.001 * scale * val;
  iteration[1][index] = 0.001 * (1 - scale) * val;
}

for (let index = 0; index < 15; index++) {
  const stretched = thirdStretched(iteration);
  const reversed = reverse(stretched);
  iteration = mix(iteration, reversed);
}
iteration = reverse(iteration);

writeData(iteration, __filename);
