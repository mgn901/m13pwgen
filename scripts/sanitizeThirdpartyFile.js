const Readline = require('readline');
const pkg = require('../package.json');

process.stdin.setEncoding('utf-8');

const reader = Readline.createInterface({
	input: process.stdin,
});
let string = '';
reader.on('line', (line) => {
	string = string + line;
})
reader.on('close', () => {
	let json = JSON.parse(string);
	const keys = Object.keys(json);
	for (let i = 0; i < keys.length; i++) {
		if (json[keys[i]].name === pkg.name) {
			delete json[keys[i]];
		} else {
			delete json[keys[i]].path;
			delete json[keys[i]].licenseFile;
		}
	}
	process.stdout.write(JSON.stringify(json, null, 2));
});
