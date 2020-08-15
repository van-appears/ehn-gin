const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const outPath = require("./src/tools/out-path");
const imageGens = [
  require("./src/images/image-gen-1"),
  require("./src/images/image-gen-2")
];

const argFiles = process.argv
  .slice(2)
  .map(x => `-${x}\.js`)
  .join("|");
const fileSuffix = argFiles ? `(${argFiles})` : "-.*.js";

const fileNum = processFile =>
  parseInt(/ehn-gin-(.*)\.js/.exec(processFile)[1]);

function processor(stillToProcess) {
  if (stillToProcess.length > 0) {
    const processFile = stillToProcess[0];
    const startTime = new Date().getTime();
    const child = childProcess.fork(processFile);
    child.on("exit", () => {
      const imageGen = imageGens[Math.floor((fileNum(processFile) - 1) / 6)];
      imageGen(processFile, () => {
        const endTime = new Date().getTime();
        const seconds = Math.round((endTime - startTime) / 1000);
        console.log(`Finished ${processFile} in ${seconds}s`);
        processor(stillToProcess.slice(1));
      });
    });
  }
}

const soundsDir = path.join(".", "src", "sounds");
const soundProcess = new RegExp(`ehn-gin${fileSuffix}`);
const processFiles = fs
  .readdirSync(soundsDir)
  .filter(x => soundProcess.test(x))
  .map(x => path.join(soundsDir, x));
processor(processFiles);
