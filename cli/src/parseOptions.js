const buildOptions = require('minimist-options'),
  minimist = require('minimist'),
  minimistOptions = buildOptions({
    actualUrl: {
      type: 'string',
      alias: ['url'],
      default: ''
    },
    originalImage: {
      type: 'string',
      alias: ['o', 'origin'],
      default: ''
    },
    actualImage: {
      type: 'string',
      alias: ['a', 'actual'],
      default: ''
    },
    saveDiffTo: {
      type: 'string',
      alias: ['s', 'diff'],
      default: ''
    },
    maxWidth: {
      type: 'number',
      default: 500
    },
    help: {
      type: 'boolean',
      alias: ['h'],
      default: false
    },
    version: {
      type: 'boolean',
      alias: ['v'],
      default: false
    }
  });

module.exports = function parseOption(argv) {
  return minimist(argv, minimistOptions);
};
