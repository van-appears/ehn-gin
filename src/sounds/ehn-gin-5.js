const { emptyData, rotatingValue, writeData } = require("../tools");
const { TWO_PI, SAMPLE_RATE } = require("../constants");
const { frames, data } = emptyData(240);

const movingPoint = (speed, limit) => {
  let vel = speed;
  let pos = 0;
  return {
    get current() {
      return pos;
    },
    move() {
      pos += vel;
      if (pos > limit || pos < -limit) {
        pos = 2 * Math.sign(pos) * limit - pos;
        vel *= -1;
      }
      return pos;
    }
  };
};

const SECTIONS = 12;
const LIMIT = 27720; // lowest number for which 1-12 are a factor
const movingPoints = new Array(SECTIONS)
  .fill(0)
  .map((_, i) => movingPoint((i + 1) * 10, LIMIT));

const pointIndex = rotatingValue(SECTIONS, SECTIONS - 1);
const alteration = rotatingValue(SECTIONS + 1);
const widths = [18, 24, 27, 36, 54, 72, 108];
widths.forEach((width, widthIndex) => {
  for (let channel = 0; channel < 2; channel++) {
    let pos = 0;
    while (pos < frames) {
      const lastVal = movingPoints[pointIndex.current].current;
      const nextVal = movingPoints[pointIndex.move()].move();
      const useWidth =
        alteration.move() === SECTIONS && channel === widthIndex % 2
          ? width + 1
          : width;
      const diff = (nextVal - lastVal) / useWidth;
      let point = lastVal;
      for (let index = 0; index < useWidth; index++) {
        point += diff;
        if (pos < frames) {
          data[channel][pos] += point;
        }
        pos++;
      }
    }
  }
});

const scaleDown = LIMIT * widths.length;
for (let index = 0; index < frames; index++) {
  data[0][index] /= scaleDown;
  data[1][index] /= scaleDown;
}

writeData(data, __filename);
