const secondsToFrames = require("./seconds-to-frames");

module.exports = seconds => {
  const frames = secondsToFrames(seconds);
  return {
    frames,
    data: [new Array(frames).fill(0), new Array(frames).fill(0)]
  };
};
