const jsdom = require("jsdom");
const { JSDOM } = jsdom;

JSDOM.fromURL("https://10minutemail.net/").then(dom => {
	console.log(dom.window.document.getElementById('fe_text').value);
});