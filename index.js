const jsdom = require("jsdom");
const puppeteer = require('puppeteer');
const { JSDOM } = jsdom;

init();

async function init() {
	// const dom = await JSDOM.fromURL("https://10minutemail.net/");
	// const email = dom.window.document.getElementById('fe_text').value;
	// console.log(email);
	await sendApiKeyToEmail("nqg44716@zzrgg.com");
	console.log('Finish');
}

async function sendApiKeyToEmail(email) {
	const args = ['--proxy-server=169.57.157.148:80'];
	const browser = await puppeteer.launch({ args });
	const page = await browser.newPage();

	await page.goto("https://10minutemail.net/", { waitUntil: 'networkidle2' });
    const element = await page.$("#fe_text");
	const text = await page.evaluate(element => element.textContent, element);
	console.log(text);
	

	// const page = await browser.newPage();
	// await page.goto("https://tinypng.com/developers", { waitUntil: 'networkidle2' });
	// await page.focus("form.developers input[name='fullName']");
	// await page.keyboard.type('Alex Hrod');
	// await page.focus("form.developers input[name='mail']");
	// await page.keyboard.type(email);
	// await page.click("form.developers input[type='submit']");

	await browser.close();
}