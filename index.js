
const puppeteer = require('puppeteer');
const clipboardy = require('clipboardy');
const uniqueNamesGenerator = require("unique-names-generator").uniqueNamesGenerator;
const names = require("unique-names-generator").names;
const adjectives = require("unique-names-generator").adjectives;

const getRandomName = uniqueNamesGenerator({
	dictionaries: [names, adjectives],
	separator: ' ',
	length: 2,
	style: 'capital'
});

init();

async function init() {
	await getApiKey();
	console.log('Finish');
	return;
}

async function getApiKey() {
	const browser = await puppeteer.launch({ headless: false });
	const context = await browser.createIncognitoBrowserContext();

	const emailPage = await context.newPage();
	await emailPage.deleteCookie();
	await emailPage.goto("https://10minemail.com/ru/");
	await emailPage.waitForSelector('.hidden-xs-sm button.click-to-copy');
	await emailPage.click('.hidden-xs-sm button.click-to-copy');

	const email = clipboardy.readSync();

	console.log("Email: " + email);

	const tinyPage = await context.newPage();
	await tinyPage.goto("https://tinypng.com/developers", { waitUntil: 'networkidle2' });
	await tinyPage.focus("form.developers input[name='fullName']");
	await tinyPage.keyboard.type(getRandomName);
	await tinyPage.focus("form.developers input[name='mail']");
	await tinyPage.keyboard.type(email);
	await tinyPage.click("form.developers input[type='submit']");

	await tinyPage.waitFor(2000);
	let isError = await tinyPage.evaluate(() => document.querySelectorAll('.error').length);
	let isSuccess = await tinyPage.evaluate(() => document.querySelectorAll('.success').length);
	await tinyPage.waitFor(2000);

	if (isError) {
		console.warn(await tinyPage.evaluate(() => document.querySelectorAll('.error').textContent));
		await browser.close();
		return;
	} else if (isSuccess) {
		console.log(await tinyPage.evaluate(() => document.querySelector('.success p').textContent));
	}

	console.log("Wait email from tiny...");

	await emailPage.waitFor(2000);
	await emailPage.waitForSelector('li:not(.hide) .viewLink.link:not(.hide)');
	await emailPage.click('li:not(.hide) .viewLink.link:not(.hide)');
	await emailPage.waitFor(2000);
	await emailPage.waitForSelector('p.button a');
	await emailPage.click('p.button a');
	await emailPage.waitFor(2000);
	await emailPage.waitForSelector('tbody .key span');

	const KEY = await emailPage.evaluate(() => document.querySelector("tbody .key span").textContent);
	console.log("KEY: " + KEY);

	await browser.close();
}