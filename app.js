const puppeteer = require('puppeteer');

(async () => {

    const url = 'https://pawiromitchel.github.io/JS-Line-art-particle-physics/';

    // 1. Launch the browser and set the resolution
    const browser = await puppeteer.launch({
        defaultViewport: {
            // 4k resolution
            width: 3040,
            height: 2160,
            isLandscape: true
        }
    });

    // 2. Open a new page
    const page = await browser.newPage();

    // 3. Navigate to URL
    await page.goto(url);

    // 3.5 Wait x sec if needed
    await page.waitForTimeout(10000);

    // 4. Take screenshot
    const date = getDate();
    await page.screenshot({ path: `./screenshots/${date}.png` });

    await browser.close();
})();

function getDate() {
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
}