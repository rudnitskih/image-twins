const {takeScreenshot, getDiffImage, calculateInvalidPixels} = require('@image-twins/core');
const sharp = require('sharp');


const compressImage = ({image, width}) => {
  if (width) {
    return sharp(image).resize({width}).toBuffer();
  } else {
    return image;
  }
};

module.exports = async (req, res, next) => {
  let {file: {buffer: originalImage}, body: {actualUrl, maxWidth = 1000}} = req;

  console.time('Taking screenshot');
  let actualImage = await takeScreenshot({
    url: actualUrl
  });
  console.timeEnd('Taking screenshot');

  console.time('Resizing');

  actualImage = await compressImage({image: actualImage, width: maxWidth});
  originalImage = await compressImage({image: originalImage, width: maxWidth});

  console.timeEnd('Resizing');

  console.time('getDiffImage');

  const diffImage = await getDiffImage({
    actualImage,
    originalImage
  });

  console.timeEnd('getDiffImage');

  console.time('calculateInvalidPixels');

  const amountInvalidPixels = await calculateInvalidPixels({diffImage});

  console.timeEnd('calculateInvalidPixels');

  const base64prefix = `data:image/png;charset=utf-8;base64,`;

  res.json({
    amountInvalidPixels,
    diffImage: `${base64prefix}${diffImage.toString('base64')}`,
    originalImage: `${base64prefix}${originalImage.toString('base64')}`,
    actualImage: `${base64prefix}${actualImage.toString('base64')}`,
  });
};
