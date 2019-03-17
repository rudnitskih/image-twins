function compressImage({image, width}) {
  const sharp = require('sharp');

  if (width) {
    return sharp(image).resize({width}).toBuffer();
  } else {
    return sharp(image).toBuffer();
  }
}

function saveDiff({image, path}) {
  const sharp = require('sharp');

  return sharp(image)
    .toFile(path);
}

function getPkgParams() {
  const fs = require('fs');

  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

function logError(errText) {
  const chalk = require('chalk');

  console.log(chalk`{bold.red Error:} {red ${errText}}`);
}

function logVersion() {
  const chalk = require('chalk'),
    {name, version} = getPkgParams();

  console.log(chalk`{bold.green ${name}}{cyan @${version}}`);
}

function logHelp() {
  const mdlog = require('mdlog')(),
    fs = require('fs'),
    helpContext = fs.readFileSync('./README.md', 'utf8');

  mdlog(helpContext);
}

module.exports = {
  compressImage,
  saveDiff,
  getPkgParams,
  logError,
  logVersion,
  logHelp
}
