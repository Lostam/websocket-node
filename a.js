var http = require('http'), httpProxy = require('http-proxy');
let arr = [7000, 8000, 9000];
for (let item of arr) {
    httpProxy.createProxyServer({ target: 'http://localhost:' + item }).listen(4000);
}
//# sourceMappingURL=a.js.map