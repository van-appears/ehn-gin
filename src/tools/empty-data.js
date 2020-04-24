const { SAMPLE_RATE } = require("../constants");

module.exports = seconds => {
  const frames = Math.floor(SAMPLE_RATE * seconds);
  return {
    frames,
    data: [new Array(frames).fill(0), new Array(frames).fill(0)]
  };
};
