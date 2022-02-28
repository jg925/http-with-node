const http = require('http');
const services = require('./services');
const url = require('url');
const jsonBody = require('body/json');
const fs = require('fs');
const formidable = require('formidable');

const server = http.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
});
server.on('request', (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (req.method === 'GET' && parsedUrl.pathname === '/metadata') {
    const { id } = parsedUrl.query;
    const metadata = services.fetchImageMetadata(id);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    const serializedJSON = JSON.stringify(metadata);
    res.end(serializedJSON);
    console.log(req.headers);
  } else if (req.method === 'POST' && parsedUrl.pathname === '/users') {
    jsonBody(req, res, (err, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
        services.createUser(body['userName']);
      }
    });
  } else if (req.method === 'POST' && parsedUrl.pathname === '/upload') {
    const form = new formidable.IncomingForm({
      uploadDir: __dirname,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5 * 1024 * 1024,
      encoding: 'utf-8',
      maxFields: 20,
    });

    form
      .parse(req)
      .on('fileBegin', (name, file) => {
        console.log('Our upload has started!');
      })
      .on('file', (name, file) => {
        console.log('Field + file pair has been received');
      })
      .on('field', (name, value) => {
        console.log('Field recieved:');
        console.log(name, value);
      })
      .on('progress', (bytesReceived, bytesExpected) => {
        console.log(bytesReceived + '/' + bytesExpected);
      })
      .on('error', (err) => {
        console.error(err);
        req.resume();
      })
      .on('aborted', () => {
        console.error('Request aborted by the user!');
      })
      .on('end', () => {
        console.log('Done - request fully received!');
        res.end('Success!');
      });
  } else {
    fs.createReadStream('./src/index.html').pipe(res);
  }
});

server.listen(8080);
