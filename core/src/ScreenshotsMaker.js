const puppeteer = require('puppeteer');

module.exports = class ScreenshotsMaker {
  async init() {
    this.browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  }

  async destroy() {
    await this.browser.close();
  }

  async take({url}) {
    const page = await this.browser.newPage();

    await page.setViewport({width: 1600, height: 890});
    await page.goto(url, {waitUntil: 'networkidle2'});

    const bodyHandle = await page.$('body');
    const {width, height} = await bodyHandle.boundingBox();

    const screenshotImage = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width,
        height
      },
      type: 'png'
    });

    await bodyHandle.dispose();

    return screenshotImage;
  }
}
