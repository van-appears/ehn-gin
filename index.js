const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const outPath = require("./src/tools/out-path");
const imageGen = require("./src/images/image-gen-1");

function process(stillToProcess) {
  if (stillToProcess.length > 0) {
    const processFile = stillToProcess[0];
    const startTime = new Date().getTime();
    const child = childProcess.fork(processFile);
    child.on("exit", () => {
      imageGen(processFile, () => {
        const endTime = new Date().getTime();
        const seconds = Math.round((endTime - startTime) / 1000);
        console.log(`Finished ${processFile} in ${seconds}s`);
        process(stillToProcess.slice(1));
      });
    });
  }
}

const soundsDir = path.join(".", "src", "sounds");
const soundProcess = /ehn-gin-.*\.js/;
const processFiles = fs
  .readdirSync(soundsDir)
  .filter(x => soundProcess.test(x))
  .map(x => path.join(soundsDir, x));
process(processFiles);
