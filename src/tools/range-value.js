module.exports = (from, to, length) => {
  let val = from;
  let counter = length;
  const diff = (to - from) / (length - 1);

  return {
    get current() {
      return val;
    },
    move() {
      counter--;
      if (counter > 0) {
        val += diff;
      }
      return val;
    }
  };
};
