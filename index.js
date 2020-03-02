
const puppeteer = require('puppeteer');

init();

async function init() {
	await sendApiKeyToEmail();
	console.log('Finish');
}

async function sendApiKeyToEmail() {
	// const args = ['--proxy-server=169.57.157.148:80'];
	const browser = await puppeteer.launch({headless: false});
	const context = await browser.createIncognitoBrowserContext();

	const emailPage = await context.newPage();
	emailPage.goto("https://10minutemail.net/", { waitUntil: 'networkidle2' });
	await emailPage.waitForSelector("#fe_text");
	let emailSelector = await emailPage.$("#fe_text");
	let email = await emailPage.evaluate(emailSelector => emailSelector.value, emailSelector);
	console.log(email)

	let emailResult = await emailPage.evaluate(() => document.getElementById("maillist").firstElementChild.childNodes.length - 1);

	console.log(emailResult, email);


	const tinyPage = await context.newPage();
	await tinyPage.goto("https://tinypng.com/developers", { waitUntil: 'networkidle2' });
	await tinyPage.focus("form.developers input[name='fullName']");
	await tinyPage.keyboard.type('Max Molod');
	await tinyPage.focus("form.developers input[name='mail']");
	await tinyPage.keyboard.type(email);
	await tinyPage.click("form.developers input[type='submit']");

	await tinyPage.waitFor(2000);
	let isError = await tinyPage.evaluate(() => document.querySelectorAll('.error').length);

	if (isError) {
		console.log('Error with tinyPNG api');
		await context.close();
		return;
	} else {
		console.log('Email send!');
	}

	console.log("Wait email from tiny...");
	await new Promise((resolve, reject) => {
		let count = 0;
		let interval = setInterval(async () => {
			let res2 = await emailPage.evaluate(() => document.getElementById("maillist").firstElementChild.childNodes.length - 1);
			count++;
			if (emailResult < res2) {
				clearInterval(interval);
				resolve();
			}
			if (count > 15) {
				clearInterval(interval);
				reject("Email not delivered!");
				await context.close();
				return;
			}
			console.log(emailResult, res2);
		}, 15000)
	});

	let getLinkToMail = await emailPage.evaluate(() => document.querySelector("#maillist tr:nth-child(2) td:nth-child(2) a").href);
	await emailPage.goto(getLinkToMail, { waitUntil: 'networkidle2' });

	console.log(getLinkToMail);

	let getLinkToTiny = await emailPage.evaluate(() => document.querySelector("div.mailinhtml .button a").href);
	await emailPage.goto(getLinkToTiny, { waitUntil: 'networkidle2' });

	let getApiKey = await emailPage.evaluate(() => document.querySelector("tbody .key span").textContent);

	console.log(getApiKey);

	await context.close();
}