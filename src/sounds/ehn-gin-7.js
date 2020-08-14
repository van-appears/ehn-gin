const { emptyData, secondsToFrames, writeData } = require("../tools");
const { SAMPLE_RADIAN } = require("../constants");
const { echo } = require("../process");
const { frames, data } = emptyData(240);

for (channel = 0; channel < 2; channel++) {
  const top = 300 + channel;
  const bottom = 301 - channel;
  for (let index = 0; index < frames; index++) {
    const freq = bottom + (top - bottom) * (index / frames);
    data[channel][index] = 0.3 * Math.sin(index * freq * SAMPLE_RADIAN);
  }
}

const applyEcho = (lengthFrom, lengthTo) =>
  echo({
    data,
    sustain: 0.5,
    length: {
      from: secondsToFrames(lengthFrom),
      to: secondsToFrames(lengthTo)
    }
  });

applyEcho(0.21, 1.21);
applyEcho(1.31, 0.31);
applyEcho(0.7, 0.9);
applyEcho(0.17, 0.15);
applyEcho(2.0, 2.1);

writeData(data, __filename);
