module.exports = (base, sorted = true) => {
  const freqs = new Array(12);
  let freq = base;
  freqs[0] = freq;
  for (var index = 1; index < freqs.length; index++) {
    freq *= 3 / 2;
    if (freq > base * 2) {
      freq /= 2;
    }
    freqs[index] = freq;
  }
  if (sorted) {
    freqs.sort();
  }
  return freqs;
};
