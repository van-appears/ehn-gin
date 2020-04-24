module.exports = (limit, initial = 0, change = 1) => {
  let pos = initial;
  return {
    get current() {
      return pos;
    },
    move() {
      pos = (pos + change) % limit;
      return pos;
    }
  };
};
