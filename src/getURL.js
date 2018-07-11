import fs from 'fs';

export default (hash) => {
	const base = JSON.parse(fs.readFileSync('base.json'));

	return base[hash];
};