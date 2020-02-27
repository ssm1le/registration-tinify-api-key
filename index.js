
const puppeteer = require('puppeteer');
var minutemail = require('10minutemail')

init();

async function init() {
	// const dom = await JSDOM.fromURL("https://10minutemail.net/");
	// const email = dom.window.document.getElementById('fe_text').value;
	// console.log(email);


	mail = minutemail({ timeout: 100000, startup: true });
	let emailAdress = await getEmail(mail);
	console.log('Getted email:', emailAdress)
	await sendApiKeyToEmail(emailAdress);
	console.log('Email send!')
	mail.start();
	console.log("Wait email...")
	await waitEmail2(mail);
	console.log('Finish', emailAdress);
}

async function getEmail(mail) {
	return new Promise((resolve) => {
		mail.on('address', (address) => resolve(address));
	})
	// mail.on('mail', (mails) => console.log(mails[0].subject));
	// mail.on('count', (count) => console.log(count));
}

async function sendApiKeyToEmail(email) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("https://tinypng.com/developers", { waitUntil: 'networkidle2' });
	await page.focus("form.developers input[name='fullName']");
	await page.keyboard.type('Max Molod');
	await page.focus("form.developers input[name='mail']");
	await page.keyboard.type(email);
	await page.click("form.developers input[type='submit']");
	await browser.close();
}

async function waitEmail2(mail) {
	return new Promise((resolve) => {
		mail.on('mail', (mails) => { 
			if(mails.length > 0) {
				console.log('mails[0].subject', mails[0].subject);
				console.log('mails', mails);
				return resolve(mails.length);
			}
		});
	})
}

async function sendApiKeyToEmail2(email) {
	const args = ['--proxy-server=169.57.157.148:80'];
	const browser = await puppeteer.launch();

	const page = await browser.newPage();
	await page.goto("https://10minutemail.net/", { waitUntil: 'networkidle2' });
	const element = await page.$("#fe_text");
	email = await page.evaluate(element => element.value, element);

	let res = await page.evaluate(() => {
		return document.getElementById("maillist").firstElementChild.childNodes.length;
	});

	console.log(res, email);

	//
	const page2 = await browser.newPage();
	await page2.goto("https://tinypng.com/developers", { waitUntil: 'networkidle2' });
	await page2.focus("form.developers input[name='fullName']");
	await page2.keyboard.type('Max Molod');
	await page2.focus("form.developers input[name='mail']");
	await page2.keyboard.type(email);
	await page2.click("form.developers input[type='submit']");
	console.log('Email send!')
	//

	const element2 = await page.$("#fe_text");
	email = await page.evaluate(element2 => element2.value, element2);
	console.log(email);
	console.log("Wait 1 minutes...");
	await new Promise(resolve => setTimeout(() => resolve(), 100000));
	let res2 = await page.evaluate(() => {
		return document.getElementById("maillist").firstElementChild.childNodes.length;
	});
	console.log(res, res2)

	// Tinify <support@tinify.com>

	await browser.close();
}
