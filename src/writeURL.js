import fs from 'fs';
import md5 from 'md5';

export default (fullURL) => {
	const base = JSON.parse(fs.readFileSync('base.json'));
	const hostName = 'http://shrt.link/';
	const hash = md5(fullURL);

	base[hash] = fullURL;
	fs.writeFileSync('base.json', JSON.stringify(base));

	return hostName + hash;
};