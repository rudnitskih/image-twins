const {takeScreenshot, getDiffImage, calculateInvalidPixels} = require('@image-twins/core');
const sharp = require('sharp');


const compressImage = ({image, width = 1200}) => {
  return sharp(image).resize({width}).toFormat('jpg').toBuffer();
};

module.exports = async (req, res, next) => {
  const {file: {buffer: originalImage}, body: {actualUrl}} = req;

  console.time('Taking screenshot');
  const actualImage = await takeScreenshot({
    url: actualUrl
  });
  console.timeEnd('Taking screenshot');

  console.time('getDiffImage');

  const diffImage = await getDiffImage({
    actualImage,
    originalImage
  });

  console.timeEnd('getDiffImage');

  console.time('calculateInvalidPixels');

  const amountInvalidPixels = await calculateInvalidPixels({diffImage});

  console.timeEnd('calculateInvalidPixels');

  const [compressedDiffImage, compressedOriginalImage, compressedActualImage] = await Promise.all([
    compressImage({image: diffImage}),
    compressImage({image: originalImage}),
    compressImage({image: actualImage})
  ]);

  res.json({
    amountInvalidPixels,
    diffImage: `data:image/jpeg;charset=utf-8;base64,${compressedDiffImage.toString('base64')}`,
    originalImage: `data:image/jpeg;charset=utf-8;base64,${compressedOriginalImage.toString('base64')}`,
    actualImage: `data:image/jpeg;charset=utf-8;base64,${compressedActualImage.toString('base64')}`,
  });
};
