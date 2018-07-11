import http from 'http';
import url from 'url';
import querystring from 'querystring';
import getURL from './getURL';
import writeURL from './writeURL';

const server = http.createServer();

server.on('request', (request, response) => {
	const parsedURL = url.parse(request.url);

	request.on('error', err => {
		console.error(err.stack);
	})

	if (request.method === 'GET') {
		response.writeHead(301, { "Location": getURL(parsedURL.path.substr(1)) });
		response.end();
	}

	if (request.method === 'POST' && parsedURL.path === '/create-link') {
		var data = '';
		request.on('data', (chunk) => {
			data += chunk.toString();
		});

		request.on('end', () => {
			if (data.length) {
				const newLink = querystring.parse(data).link;
				response.write(JSON.stringify({status: 'success', shortURL: writeURL(newLink)}));
				response.end();
			}
		});
	}
});

const port = 4000;
server.listen(port, (err) => {
	if (err)
		return console.log('something bad happened', err);

	console.log('Server has been started');
});