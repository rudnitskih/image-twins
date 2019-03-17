#!/usr/bin/env node

cli();

function cli() {
  const parseOption = require('./src/parseOptions'),
    options = parseOption(process.argv.slice(2)),
    defaultFlow = require('./src/tasks'),
    {logError, logVersion, logHelp} = require('./src/utils');

  if (options.version) {
    return logVersion();
  }

  if (options.help) {
    return logHelp();
  }

  if ((options.actualImage || options.actualUrl) && options.originalImage) {
    return defaultFlow
        .run({options})
        .then(({amountInvalidPixels}) => console.log(`Amount of invalid pixels: `, amountInvalidPixels));
  }

  logError(`Sorry. I did not understand you... May be you need to read a help:`);
  return logHelp();
}
