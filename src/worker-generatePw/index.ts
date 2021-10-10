import jsSHA from 'jssha';

self.addEventListener('message', (e) => {
	let input = e.data;
	for (let i = 0; i < 10000; i++) {
		const shaObj = new jsSHA('SHA3-512', 'TEXT', { encoding: 'UTF8' });
		shaObj.update(input);
		input = shaObj.getHash('B64');
	}
	input = input.replaceAll('/', '-').replaceAll('+', '_').replaceAll('=', '_');
	postMessage(input);
});

export {}
