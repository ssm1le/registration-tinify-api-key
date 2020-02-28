
const puppeteer = require('puppeteer');
var minutemail = require('10minutemail')

init();

async function init() {
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
	await new Promise((resolve, reject) => {
		let count = 0;
		let interval = setInterval(async () => {
			let res2 = await page.evaluate(() => document.getElementById("maillist").firstElementChild.childNodes.length - 1);
			count++;
			if (res < res2) {
				clearInterval(interval);
				resolve();
			}
			if (count > 15) {
				reject("Email not delivered!");
			}
			console.log(res, res2);
		}, 15000)
	});
	let link = await page.evaluate(() => document.querySelector("#maillist tr:nth-child(2) td:nth-child(2) a").href);
	await page.goto(link, { waitUntil: 'networkidle2' });
	const element4 = await page.$("#fe_text");
	email = await page.evaluate(element4 => element4.value, element4);
	console.log(link, email);

	let link2 = await page.evaluate(() => document.querySelector("div.mailinhtml .button a").href);
	await page.goto(link2, { waitUntil: 'networkidle2' });

	let KEY = await page.evaluate(() => document.querySelector("tbody .key span").textContent);

	console.log(KEY);

	await browser.close();
}
