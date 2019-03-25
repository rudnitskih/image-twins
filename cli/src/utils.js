const sharp = require('sharp');
const chalk = require('chalk');
const mdlog = require('mdlog')();
const fs = require('fs');


function saveDiff({image, path}) {
  return sharp(image).toFile(path);
}

function getPkgParams() {
  const fs = require('fs');

  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

function logError(errText) {

  console.log(chalk`{bold.red Error:} {red ${errText}}`);
}

function logVersion() {
  const {name, version} = getPkgParams();

  console.log(chalk`{bold.green ${name}}{cyan @${version}}`);
}

function logHelp() {
  const helpContext = fs.readFileSync('./README.md', 'utf8');

  mdlog(helpContext);
}

function logResult(amountInvalidPixels) {
  const amountValidPixels = 100 - amountInvalidPixels;

  console.log(
    chalk.hsl(numberToHue(amountValidPixels), 100, 50)(`Markup and mockup the same on: ${amountValidPixels.toFixed(2)}%`)
  );
}

function numberToHue(i) {
  // red = 0° and green = 120°
  return Math.round(i) * 1.2;
}

module.exports = {
  saveDiff,
  logError,
  logVersion,
  logHelp,
  logResult
};
