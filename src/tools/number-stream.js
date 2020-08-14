module.exports = (numerator, denominator, digits = 1) => {
  const multiplier = Math.pow(10, digits);
  while (numerator < denominator) {
    numerator *= 10;
  }
  let remainder = numerator;
  return () => {
    const result = Math.floor(remainder / denominator);
    remainder = (remainder - result * denominator) * multiplier;
    return result;
  };
};
