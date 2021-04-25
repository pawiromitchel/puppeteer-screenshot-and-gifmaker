const puppeteer = require('puppeteer');
const helper = require("./helpers");

// init settings
const url = process.env.URL;
const resolution = {
    defaultViewport: {
        // 4k resolution
        width: 3040,
        height: 2160,
        isLandscape: true
    }
};

(async () => {

    // 1. Launch the browser and set the resolution
    const browser = await puppeteer.launch(resolution);

    // 2. Open a new page
    const page = await browser.newPage();

    // 3. Navigate to URL
    await page.goto(url);

    // 3.5 Wait x sec if needed
    await page.waitForTimeout(10000);

    // 4. Take screenshot
    await page.screenshot({ path: `./screenshots/${helper.getDate()}.png` });

    await browser.close();
})();
