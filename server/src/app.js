import path from 'path';
import bodyParser from 'body-parser';
import Express from 'express';
import getURL from './partials/getURL';
import writeURL from './partials/writeURL';
import getIndexPage from './partials/getIndexPage';

const app = Express();
const port = 5000;

app.use('/assets', Express.static(path.join(__dirname, 'assets')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(getIndexPage());
  res.sendStatus(200);
});

app.get('/:hash', (req, response) => {
  getURL(req.params.hash)
    .then((res) => {
      response.redirect(res);
    })
    .catch(() => {
      response.sendStatus(500);
    });
});

app.post('/create-link', (req, response) => {
  console.log(req.body);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});

/*
  const server = http.createServer();

  server.on('request', (request, response) => {
    const parsedURL = url.parse(request.url);

    request.on('error', (err) => {
      console.error(err.stack);
    });

    if (request.method === 'GET') {
      getURL(parsedURL.path.substr(1))
        .then((res) => {
          response.writeHead(301, { Location: res });
          response.end();
        })
        .catch(() => {
          response.writeHead(500);
          response.end();
        });
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
                response.end();
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
*/
