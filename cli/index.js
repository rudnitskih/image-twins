#!/usr/bin/env node

const defaultFlow = require('./src/tasks');
const parseOption = require('./src/parseOptions');
const {logError, logVersion, logHelp, logResult} = require('./src/utils');

cli();

function cli() {
  const options = parseOption(process.argv.slice(2));

  if (options.version) {
    return logVersion();
  }

  if (options.help) {
    return logHelp();
  }

  if ((options.actualImage || options.actualUrl) && options.originalImage) {
    return defaultFlow
        .run({options})
        .then(({amountInvalidPixels}) => logResult(amountInvalidPixels));
  }

  logError(`Sorry. I did not understand you... May be you need to read a help:`);
  return logHelp();
}
