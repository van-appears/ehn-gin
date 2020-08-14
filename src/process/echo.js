const { rangeValue } = require("../tools");

const asFun = (opt, frames) => {
  if (typeof opt === "function") {
    return opt;
  }
  if (typeof opt === "object") {
    const { from, to } = opt;
    const fn = rangeValue(from, to, frames);
    return () => {
      const ret = fn.current;
      fn.move();
      return ret;
    };
  }
  return () => opt;
};

const echo = ({
  data,
  length = 44100,
  sustain = 0.5,
  start = 0,
  end,
  dry = 1,
  wet = 1
}) => {
  if (!end) {
    end = data[0].length;
  }

  const frames = end - start;
  const sustainFn = asFun(sustain, frames);
  const lengthFn = asFun(length, frames);
  const wetFn = asFun(wet, frames);
  const dryFn = asFun(dry, frames);

  let echoPos = 0;
  let lastLength = Math.floor(lengthFn());
  const echodata = [
    new Array(lastLength).fill(0),
    new Array(lastLength).fill(0)
  ];

  const expand = () => {
    echodata[0].push(echodata[0][echodata[0].length - 1]);
    echodata[1].push(echodata[1][echodata[1].length - 1]);
    return echodata[0].length;
  };

  const shrink = () => {
    echodata[0].pop();
    echodata[1].pop();
    return echodata[0].length;
  };

  const softenChannel = channel => {
    const length = echodata[channel].length;
    const before1 = echodata[channel][(echoPos + length - 4) % length];
    const before2 = echodata[channel][(echoPos + length - 5) % length];
    const before3 = echodata[channel][(echoPos + length - 6) % length];
    const before4 = (before1 + before3) / 2;
    echodata[channel][(echoPos + length - 5) % length] =
      before2 * 0.7 + before4 * 0.3;
  };

  for (let index = start; index < end; index++) {
    let wetVal = wetFn();
    let dryVal = dryFn();
    let sustainVal = sustainFn();

    for (let channel = 0; channel < 2; channel++) {
      const srcVal = data[channel][index];
      const echoVal = echodata[channel][echoPos];
      data[channel][index] = dryVal * srcVal + wetVal * echoVal;
      echodata[channel][echoPos] = (echoVal - srcVal) * sustainVal;
      softenChannel(channel);
    }

    let newLength = Math.floor(lengthFn());
    if (newLength > lastLength) {
      lastLength = expand();
    } else if (newLength < lastLength) {
      lastLength = shrink();
    }

    echoPos = (echoPos + 1) % echodata[0].length;
  }
};

module.exports = echo;
