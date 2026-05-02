const { emptyData, pow, rotatingArray, writeData } = require("../tools");
const { TWO_PI, SAMPLE_RADIAN } = require("../constants");
const { frames, data } = emptyData(240);

// create song structure
const pitch = [240, 180, 320, 270, 300, 200];
const patterns = [
  [1, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 5, 0, 0, 3, 0, 4, 0, 0, 0],
  [0, 0, 6, 0, 0, 0, 0, 4, 0]
];
const volume = new Array(180) // LCD of pattern lengths
  .fill(0)
  .map(
    (_, i) =>
      (patterns[0][i % patterns[0].length] > 0 ? 1 : 0) +
      (patterns[1][i % patterns[1].length] > 0 ? 1 : 0) +
      (patterns[2][i % patterns[2].length] > 0 ? 1 : 0)
  );

const addSound = (pitch, pos, wetVol, length, exps, delay) => {
  let rad = 0;
  const radChange = pitch * SAMPLE_RADIAN;
  for (let index = 0; index < length; index++) {
    const env =
      index < 4410 ? index / 4410 : 1.0 - (index - 4410) / (length - 4410);
    const val = Math.sin(rad);
    const val0 = pow(val, exps[0]);
    const val1 = pow(val, exps[1]);
    const ring0 = pos > delay ? (data[0][pos + index - delay] + 1) / 2 : 1;
    const ring1 = pos > delay ? (data[1][pos + index - delay] + 1) / 2 : 1;

    data[0][pos + index] += ring1 * val0 * env * wetVol;
    data[1][pos + index] += ring0 * val1 * env * wetVol;
    rad = (rad + radChange) % TWO_PI;
  }
};

const dist = frames - 100000;
const delays = [6000, 7777, 9876];
const exps = rotatingArray([
  [0.8, 1.0],
  [1.0, 1.25],
  [1.25, 0.8]
]);

patterns.forEach((pattern, index) => {
  let pos = 0;
  const nextPattern = rotatingArray(pattern);
  const nextVol = rotatingArray(volume);
  while (pos < dist) {
    if (nextPattern.current > 0) {
      addSound(
        pitch[nextPattern.current - 1],
        pos,
        0.75 / nextVol.current,
        44100 * (2.0 + (2.0 * pos) / dist),
        exps.current,
        delays[index]
      );
      exps.current.reverse();
      exps.move();
    }
    pos += 20000 + Math.floor((40000 * pos) / dist);
    nextPattern.move();
    nextVol.move();
  }
});

writeData(data, __filename);
