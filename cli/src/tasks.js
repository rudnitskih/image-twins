const Listr = require('listr'),
  {takeScreenshot, getDiffImage, calculateInvalidPixels} = require('@image-twins/core'),
  {logError, compressImage, saveDiff} = require('./utils');

module.exports = new Listr([
  {
    title: `Looking for original image`,
    enabled: ({options: {originalImage}}) => !!originalImage,
    task: ctx => {
      const {options: {originalImage, maxWidth}} = ctx;

      return compressImage({image: originalImage, width: maxWidth})
        .then(buffer => {
          ctx.originalImage = buffer;
        });
    }
  },
  {
    title: `Try to create screenshot`,
    enabled: ({options: {actualUrl, actualImage}}) => !!actualUrl && !actualImage,
    task: ctx => {
      const {options: {actualUrl, maxWidth}} = ctx;

      return takeScreenshot({url: actualUrl})
        .then(buffer => {
          ctx.actualImageBuffer = buffer;
        });
    }
  },
  {
    title: `Looking for actual image`,
    enabled: ({actualImageBuffer, options: {actualImage}}) => !!actualImage || !!actualImageBuffer,
    task: ctx => {
      const {actualImageBuffer, options: {actualImage, maxWidth}} = ctx;

      return compressImage({image: actualImage || actualImageBuffer, width: maxWidth})
        .then(buffer => {
          ctx.actualImage = buffer;
        });
    }
  },
  {
    title: `Calculate image diff`,
    task: ctx => {
      const {originalImage, actualImage} = ctx;

      return getDiffImage({originalImage, actualImage})
        .then(diffImage => {
          ctx.diffImage = diffImage
        });
    }
  },
  {
    title: `Calculate invalid pixels`,
    task: ctx => {
      const {diffImage} = ctx;

      return calculateInvalidPixels({diffImage})
        .then(amountInvalidPixels => {
          ctx.amountInvalidPixels = amountInvalidPixels;
        });
    }
  },
  {
    title: `Save image diff`,
    enabled: ({diffImage, options: {saveDiffTo}}) => !!diffImage && !!saveDiffTo,
    task: ({diffImage, options: {saveDiffTo}}) => saveDiff({image: diffImage, path: saveDiffTo})
  }
]);
