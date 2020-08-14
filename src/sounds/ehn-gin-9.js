const { emptyData, pow, writeData } = require("../tools");
const { TWO_PI, SAMPLE_RATE, SAMPLE_RADIAN } = require("../constants");

const length = 240 * SAMPLE_RATE;
let data = new Array(length).fill(0);
let lastData = new Array(length).fill(0);

const valueAt = from => speed => {
  let pos = 0;
  return () => {
    const before = from[Math.floor(pos)];
    const after = from[Math.floor(pos) + 1];
    const diff = after - before;
    const ratio = pos - Math.floor(pos);
    pos += speed;
    return before + ratio * (after - before);
  };
};

const baseFreq = 200;
const moves = [0.007, 0.1, 0.03];

moves.forEach((_, mIndex) => {
  const lastValueAt = valueAt(lastData);
  let rad = 0;
  const ampMov = lastValueAt(moves[mIndex]);
  const powMov = lastValueAt(moves[(mIndex + 1) % moves.length]);
  const freqMov = lastValueAt(moves[(mIndex + 2) % moves.length]);

  for (let index = 0; index < length; index++) {
    const ampMod = (ampMov() + 1) / 2.0;
    const powMod = powMov() / 2.0 + 1.0;
    const freqMod = (freqMov() + 20.0) / 20.0;

    rad = (rad + SAMPLE_RADIAN * baseFreq * freqMod) % TWO_PI;
    data[index] = pow(Math.sin(rad) * ampMod, powMod);
  }

  lastData = data;
  data = new Array(length).fill(0);
});

writeData([lastData, lastData], __filename);
