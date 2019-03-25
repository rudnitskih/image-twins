const Listr = require('listr');
const {takeScreenshot, getDiffImage, calculateInvalidPixels, compressImage} = require('@image-twins/core');
const {saveDiff} = require('./utils');

module.exports = new Listr([
  {
    title: `Processing original image`,
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
    enabled: ({options: {actualUrl, actualImage}}) => !actualImage,
    task: ctx => {
      const {options: {actualUrl, maxWidth}} = ctx;

      return takeScreenshot({url: actualUrl, width: maxWidth})
        .then(buffer => {
          ctx.actualImageBuffer = buffer;
        });
    }
  },
  {
    title: `Processing actual image`,
    task: ctx => {
      const {actualImageBuffer, options: {actualImage, maxWidth}} = ctx;

      return compressImage({image: actualImage || actualImageBuffer, width: maxWidth})
        .then(buffer => {
          ctx.actualImage = buffer;
        });
    }
  },
  {
    title: `Calculate images diff`,
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
