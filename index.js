
const puppeteer = require('puppeteer');
var minutemail = require('10minutemail')

init();

async function init() {
	// const dom = await JSDOM.fromURL("https://10minutemail.net/");
	// const email = dom.window.document.getElementById('fe_text').value;
	// console.log(email);

	await sendApiKeyToEmail2();
	console.log('Finish');
}

async function sendApiKeyToEmail2(email) {
	// const args = ['--proxy-server=169.57.157.148:80'];
	const browser = await puppeteer.launch();

	const page = await browser.newPage();
	await page.goto("https://10minutemail.net/", { waitUntil: 'networkidle2' });
	const element = await page.$("#fe_text");
	email = await page.evaluate(element => element.value, element);
	console.log(email)

	let res = await page.evaluate(() => {
		return document.getElementById("maillist").firstElementChild.childNodes.length - 1;
	});

	console.log(res, email);

	
	const page2 = await browser.newPage();
	await page2.goto("https://tinypng.com/developers", { waitUntil: 'networkidle2' });
	await page2.focus("form.developers input[name='fullName']");
	await page2.keyboard.type('Max Molod');
	await page2.focus("form.developers input[name='mail']");
	await page2.keyboard.type(email);
	await page2.click("form.developers input[type='submit']");
	console.log('Email send!')
	

	const element2 = await page.$("#fe_text");
	email = await page.evaluate(element2 => element2.value, element2);
	console.log(email);
	console.log("Wait 1 minutes...");
	await new Promise(resolve => setTimeout(() => resolve(), 100000));
	let res2 = await page.evaluate(() => {
		return document.getElementById("maillist").firstElementChild.childNodes.length - 1;
	});
	console.log(res, res2)
	await page.click("#maillist tbody tr:nth-of-type(2)");
	let href = await page.evaluate(() => {
		return document.querySelector("div.mailinhtml .button a").href;
	});
	console.log(href);

	// Tinify <support@tinify.com>

	await browser.close();
}
