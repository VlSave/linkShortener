import http from 'http';
import url from 'url';
import querystring from 'querystring';
import getURL from './getURL';
import writeURL from './writeURL';

const server = http.createServer();

server.on('request', (request, response) => {
  const parsedURL = url.parse(request.url);

  request.on('error', (err) => {
    console.error(err.stack);
  });

  if (request.method === 'GET') {
    const newLocation = getURL(parsedURL.path.substr(1));

    newLocation
      .then(
        res => response.writeHead(301, { Location: res }),
        e => response.writeHead(500)
      );

    response.end();
  }

  if (request.method === 'POST' && parsedURL.path === '/create-link') {
    let data = '';
    request.on('data', (chunk) => {
      data += chunk.toString();
    });

    request.on('end', () => {
      if (data.length) {
        const newLink = querystring.parse(data).link;
        const newShortURL = writeURL(newLink);

        newShortURL
          .then(
            (res) => {
              response.write(JSON.stringify({ status: 'success', shortURL: res }));
              response.end();
            },
            (e) => {
              response.writeHead(500);
            }
          );
      }
    });
  }
});

const port = 4040;
server.listen(port, (err) => {
  if (err) { return console.log('something bad happened', err); }

  console.log('Server has been started');
});
