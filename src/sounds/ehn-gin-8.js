const {
  emptyData,
  numberStream,
  rangeValue,
  twelveTone,
  writeData
} = require("../tools");
const { frames, data } = emptyData(240);
const { TWO_PI, SAMPLE_RADIAN } = require("../constants");

const freqs = twelveTone(300);
const number = numberStream(1, 26121975, 5);

for (let channel = 0; channel < 2; channel++) {
  let add = true;
  let decision = 11025;
  const freq = rangeValue(freqs[0], freqs[0], decision);
  const rows = [{ rad: 0, index: 0, freq }];

  for (var index = 0; index < frames; index++) {
    const val = rows.reduce((a, g) => a + Math.sin(g.rad), 0) / 10;
    data[channel][index] = val;
    rows.forEach((r, i) => {
      r.rad += r.freq.current * SAMPLE_RADIAN;
      r.rad = r.rad % TWO_PI;
      r.freq.move();
    });

    decision--;
    if (decision <= 0) {
      decision = number();
      const index = number() % rows.length;
      let lastIndex = rows[index].index;
      const nextIndex = (rows[index].index = (lastIndex + 1) % freqs.length);
      rows[index].freq = rangeValue(
        freqs[lastIndex],
        freqs[nextIndex],
        decision
      );

      if (nextIndex === 0) {
        if (add) {
          rows.push({ rad: 0, index: 0, freq });
          add = rows.length < 10;
        } else {
          rows.slice(0, index).concat(rows.slice(index + 1));
        }
      }
    }
  }
}

writeData(data, __filename);
