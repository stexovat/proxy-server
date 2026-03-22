const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const targetUrl = url.parse(req.url);

  const options = {
    hostname: targetUrl.hostname,
    port: 80,
    path: targetUrl.path,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (response) => {
    res.writeHead(response.statusCode, response.headers);
    response.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });
});

server.listen(3000, () => {
  console.log('Proxy running on port 3000');
});
