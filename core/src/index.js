const ScreenshotsMaker = require('./ScreenshotsMaker.js');
const ImageDiffer = require('./ImageDiffer.js');
const sharp = require('sharp');

const imageDiffer = new ImageDiffer();

module.exports = {
  takeScreenshot: async ({url}) => {
    const screenshotsMaker = new ScreenshotsMaker();

    await screenshotsMaker.init();
    const screenshot = await screenshotsMaker.take({url});
    await screenshotsMaker.destroy();

    return screenshot;
  },

  getDiffImage: ({originalImage, actualImage}) => {
    return imageDiffer.process({originalImage, actualImage});
  },

  calculateInvalidPixels: ({diffImage}) => {
    return imageDiffer.calculatePixels({diffImage});
  },

  compressImage: ({image, width}) => {
    if (width) {
      return sharp(image).resize({width}).toBuffer();
    } else {
      return image;
    }
  }
};
