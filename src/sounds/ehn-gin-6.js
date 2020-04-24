const { emptyData, pow, writeData } = require("../tools");
const { TWO_PI, SAMPLE_RATE } = require("../constants");
const { frames, data } = emptyData(240);

// populate the first three seconds
for (let index = 0; index < 3 * SAMPLE_RATE; index++) {
  let val = Math.sin((TWO_PI * index * 0.5) / SAMPLE_RATE);
  val = Math.sin((TWO_PI * index * (1 + val) * 1.5) / SAMPLE_RATE);
  val = Math.sin((TWO_PI * index * (100 + 10 * val)) / SAMPLE_RATE);
  val *= 0.8;
  data[0][index] = val;
  data[1][index] = val;
}

const makeLFO = freq => {
  const change = (freq * TWO_PI) / SAMPLE_RATE;
  let radian = 0.0;
  return () => {
    const val = (1 + Math.sin(radian)) / 2.0; // scaled as 0-to-1 rather that -1-to-1
    radian = (radian + change) % TWO_PI;
    return val;
  };
};

const makeLFOs = freqs => {
  const lfos = freqs.map(freq => makeLFO(freq));
  return () => lfos.map(lfo => lfo());
};

const lfoFreqs = [
  [0.39, 0.35, 0.31, 0.25],
  [0.4, 0.36, 0.315, 0.27]
];

for (let channel = 0; channel < 2; channel++) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let val = 0;
  let lastVal = 0;
  const lfos = makeLFOs(lfoFreqs[channel]);
  const channelValue = pos => data[channel][Math.floor(pos)];

  for (let index = 3 * SAMPLE_RATE; index < frames; index++) {
    const [lfo1val, lfo2val, lfo3val, lfo4val] = lfos();
    val = channelValue(pos1) * lfo1val;
    val += channelValue(pos2) * lfo2val;
    val -= channelValue(pos3) * (2.0 - lfo1val - lfo2val);
    val = pow(val / 2.0, 0.8 + 0.25 * lfo3val);
    val = lastVal + (val - lastVal) * (1.0 - 0.3 * lfo4val);
    data[channel][index] = val;
    lastVal = val;
    pos1 += 0.7;
    pos2 += 0.6;
    pos3 += 1.0;
  }
}

writeData(data, __filename);
