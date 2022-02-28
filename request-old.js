const https = require('https');

const data = JSON.stringify({
  userName: 'jgui32',
});
const options = {
  hostname: 'localhost',
  port: 443,
  path: '/users',
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    Authorization: Buffer.from('myUsername' + ':' + 'myPassword').toString(
      'base64'
    ),
  },
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  console.log(res.headers);

  res.on('data', (chunk) => {
    console.log('This is a chunk: \n');
    console.log(chunk.toString());
  });
});

req.on('error', (err) => {
  console.error(err);
});

req.write(data);

req.end();
