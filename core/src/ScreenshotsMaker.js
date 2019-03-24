const puppeteer = require('puppeteer');

const MOST_POPULAR_ASPECT_RATIO = 16 / 9;

module.exports = class ScreenshotsMaker {
  async init() {
    this.browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  }

  async destroy() {
    await this.browser.close();
  }

  async take({url, width = 1600, height = width / MOST_POPULAR_ASPECT_RATIO}) {
    const page = await this.browser.newPage();

    await page.setViewport({width, height});
    await page.goto(url, {waitUntil: 'networkidle2'});

    const bodyHandle = await page.$('body');
    const {width: pageWidth, height: pageHeight} = await bodyHandle.boundingBox();

    const screenshotImage = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight
      },
      type: 'png'
    });

    await bodyHandle.dispose();

    return screenshotImage;
  }
}
