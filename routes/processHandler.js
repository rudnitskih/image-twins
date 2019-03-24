const {takeScreenshot, getDiffImage, calculateInvalidPixels, compressImage} = require('@image-twins/core');

module.exports = async (req, res, next) => {
  let {file: {buffer: originalImage}, body: {actualUrl, maxWidth = 1000}} = req;

  let actualImage = await withTime(
    'Taking screenshot', () => {
      return takeScreenshot({
        url: actualUrl
      });
    });

  [actualImage, originalImage] = await withTime(
    'Resizing', () => {
      return Promise.all([
        compressImage({image: actualImage, width: maxWidth}),
        compressImage({image: originalImage, width: maxWidth})
      ]);
    });

  const diffImage = await withTime('getDiffImage', () => {
    return getDiffImage({
      actualImage,
      originalImage
    });
  });

  const amountInvalidPixels = await withTime('calculateInvalidPixels', () => {
    return calculateInvalidPixels({diffImage});
  });

  const base64prefix = `data:image/png;charset=utf-8;base64,`;

  res.json({
    amountInvalidPixels,
    diffImage: `${base64prefix}${diffImage.toString('base64')}`,
    originalImage: `${base64prefix}${originalImage.toString('base64')}`,
    actualImage: `${base64prefix}${actualImage.toString('base64')}`,
  });
};

const withTime = async (label, process) => {
  console.time(label);

  const result = await process();

  console.timeEnd(label);

  return result;
};
