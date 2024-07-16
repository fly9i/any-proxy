const https = require('https');
const http = require('http');  // 使用http模块创建服务器

const PORT = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

const requestHandler = (clientReq, clientRes) => {
  let headers = clientReq.headers;
  delete headers['host'];
  delete headers['connection'];
  delete headers['x-forwarded-for'];
  delete headers['x-forwarded-host'];
  delete headers['x-forwarded-proto'];
  delete headers['x-real-ip'];
  const options = {
    hostname,  // 目标主机名
    port: 443,  // 目标端口
    path: clientReq.url,  // 请求路径
    method: clientReq.method,
    headers
  };

  const proxy = https.request(options, (res) => {
    clientRes.writeHead(res.statusCode, res.headers);
    res.pipe(clientRes, {
      end: true
    });
  });

  clientReq.pipe(proxy, {
    end: true
  });

  proxy.on('error', (err) => {
    console.error(err);
    clientRes.writeHead(500);
    clientRes.end('Something went wrong.');
  });
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
