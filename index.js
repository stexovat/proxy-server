const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  const lib = parsedUrl.protocol === 'https:' ? https : http;

  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: req.method,
    headers: {
      ...req.headers,
      'user-agent': 'Mozilla/5.0',
    },
  };

  const proxy = lib.request(options, (response) => {
    res.writeHead(response.statusCode, response.headers);
    response.pipe(res, { end: true });
  });

  proxy.on('error', () => {
    res.writeHead(500);
    res.end('Proxy error');
  });

  req.pipe(proxy, { end: true });
});

server.listen(3000, () => {
  console.log('Proxy running');
});
