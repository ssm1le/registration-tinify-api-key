const puppeteer = require('puppeteer');
const clipboardy = require('clipboardy');

(async () => {
    const browser = await puppeteer.launch();
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    await page.setViewport({ width: 1920, height: 1080 });
    await page.deleteCookie();
    await page.goto("https://mohmal.com/ru");
    await page.click('#rand');
    await page.waitFor(2000);
    await page.waitForSelector('#email > div.email');
    await page.click('#email > div.email');

    console.log('Taked e-mail!');
    await page.goto("https://vpnmonster.ru/");
    await page.type('#email', clipboardy.readSync());
    await page.click('#email-form > input.button.w-button');
    console.log('Waiting....');
    await page.waitForSelector('#email-form > input._3.partner_button.w-button');
    await page.click('#email-form > input._3.partner_button.w-button');
    await page.waitForSelector('body > div.sect > div > div.dfhsfdtgjnsfhgdfgn > div > div.srahadrh.w-col.w-col-6 > div');

    const text = await page.evaluate(() => document.querySelector('body > div.sect > div > div.dfhsfdtgjnsfhgdfgn > div > div.srahadrh.w-col.w-col-6 > div').textContent);
    await console.log('Key ' + text);
    await browser.close();
})();