const looksSame = require("looks-same");
const PNG = require('png-js');

module.exports = class ImageDiffer {
  process({originalImage, actualImage}) {
    return new Promise((resolve, reject) => {
      looksSame.createDiff({
        reference: originalImage,
        current: actualImage,
        highlightColor: '#ff00ff', // color to highlight the differences
        strict: false,
        tolerance: 5,
        antialiasingTolerance: 3,
        ignoreCaret: true // ignore caret by default
      }, function (error, buffer) {
        if (error) {
          reject(error);
        }

        resolve(buffer);
      });
    });
  }

  calculatePixels({diffImage, wrongColor}) {
    return new Promise((resolve) => {
      const png = new PNG(diffImage);

      png.decode(function (pixels) {
        let wrongPixelsAmount = 0;

        for (let i = 0; i <= pixels.length; i += 4) {
          const redChannel = pixels[i];
          const greenChannel = pixels[i + 1];
          const blueChannel = pixels[i + 2];
          const alphaChannel = pixels[i + 3];

          if (redChannel === 255
            && greenChannel === 0
            && blueChannel === 255
            && alphaChannel === 255
          ) {
            wrongPixelsAmount++;
          }
        }

        const accurateRate = (1 - wrongPixelsAmount / (pixels.length / 4)) * 100;

        resolve(accurateRate);
      });
    });
  }
};
