const rotatingValue = require('./rotating-value');

module.exports = array => {
  const pos = rotatingValue(array.length);
  return {
    get current() {
      return array[pos.current];
    },
    move() {
      pos.move();
      return array[pos.current];
    }
  };
};
