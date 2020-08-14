const { emptyData, twelveTone, writeData } = require("../tools");
const { frames, data } = emptyData(240);
const { SAMPLE_RATE, SAMPLE_RADIAN } = require("../constants");

const length = 60 * SAMPLE_RATE;

const makeSound = (freq1, freq2, osc) => {
  const sound = new Array(length);
  const envLength = (Math.PI * 3) / (2 * length);
  for (let index = 0; index < length; index++) {
    const val1 = Math.sin(
      Math.sin(freq1 * index * SAMPLE_RADIAN) * osc * index * SAMPLE_RADIAN
    );
    const val2 = Math.sin(
      Math.sin(freq2 * index * SAMPLE_RADIAN) * osc * index * SAMPLE_RADIAN
    );
    const env = Math.sin(envLength * index) + index / length;
    sound[index] = ((val1 + val2) * env) / 5;
  }
  return sound;
};

const freqs = twelveTone(70, false);
const space = (frames - length) / (freqs.length - 1);
for (let channel = 0; channel < 2; channel++) {
  const up = (1 - channel) / 10;
  const down = channel / 10;

  for (let f = 0; f < freqs.length; f++) {
    const sound = makeSound(
      freqs[f] + up,
      freqs[(f + 3) % freqs.length] + down,
      freqs[(f + 5) % freqs.length] / 35
    );
    const pos = Math.floor(space * f);
    for (let index = 0; index < length; index++) {
      data[channel][pos + index] += sound[index];
    }
  }
}

/*for (let wrap = 0; wrap < 3; wrap++) {
for (let index = 0; index < frames; index++) {
  if (index > 3) {
    const last3 = data[0][index - 3];
    const last2 = data[0][index - 2];
    const last1 = data[0][index - 1];
    const softer = (last2 + ((last1 + last3) / 2)) / 2;
    data[0][index - 2] = softer;
    data[1][index - 2] = softer;
  }
}
}*/

writeData(data, __filename);
