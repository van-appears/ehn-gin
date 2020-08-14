const { SAMPLE_RATE } = require("../constants");

module.exports = seconds => Math.floor(SAMPLE_RATE * seconds);
