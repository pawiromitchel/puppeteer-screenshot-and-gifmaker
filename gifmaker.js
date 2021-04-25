const puppeteer = require('puppeteer');
const GIFEncoder = require('gif-encoder');
const getPixels = require('get-pixels');
const helper = require("./helpers");

// init settings
const url = 'https://pawiromitchel.github.io/JS-Line-art-particle-physics/';
const amountOfFrames = 120;
const viewPortResolution = { width: 800, height: 600 };

(async () => {
    const encoder = new GIFEncoder(800, 600);
    const fs = require('fs');
    const workDir = './temp/';
    let file = require('fs').createWriteStream(`./gifs/${helper.getDate()}.gif`);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    if (!fs.existsSync(workDir)) {
        fs.mkdirSync(workDir);
    };

    // Setup gif encoder parameters
    encoder.setFrameRate(60);
    encoder.pipe(file);
    encoder.setQuality(40);
    encoder.setDelay(25);
    encoder.writeHeader();
    encoder.setRepeat(0);

    // Helper functions declaration
    function addToGif(images, counter = 0) {
        getPixels(images[counter], function (err, pixels) {

            encoder.addFrame(pixels.data);
            encoder.read();
            if (counter === images.length - 1) {
                encoder.finish();
                cleanUp(images, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        fs.rmdirSync(workDir);
                        console.log('Gif created!');
                        process.exit(0);
                    }
                });

            } else {
                addToGif(images, ++counter);
            }
        });
    };

    function cleanUp(listOfPNGs, callback) {
        let i = listOfPNGs.length;
        listOfPNGs.forEach(function (filepath) {
            fs.unlink(filepath, function (err) {
                i--;
                if (err) {
                    callback(err);
                    return;
                } else if (i <= 0) {
                    callback(null);
                }
            });
        });
    };

    await page.setViewport(viewPortResolution);
    await page.goto(url);

    for (let i = 0; i < amountOfFrames; i++) {
        await page.screenshot({ path: workDir + i + ".png" });
    }

    await browser.close();

    let listOfPNGs = fs.readdirSync(workDir)
        .map(a => a.substr(0, a.length - 4) + '')
        .sort(function (a, b) { return a - b })
        .map(a => workDir + a.substr(0, a.length) + '.png');

    addToGif(listOfPNGs);
})();