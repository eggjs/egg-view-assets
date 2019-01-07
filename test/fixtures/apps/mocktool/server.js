'use strict';

const http = require('http');
const Koa = require('koa');

const port = Number(process.argv[2]) || 8000;

console.info('[server] SOCKET_SERVER: ' + process.env.SOCKET_SERVER);

const app = new Koa();
app.use(async ctx => {
  ctx.body = 'done';
});

const server = http.createServer(app.callback());
server.once('error', err => {
  console.error('[server]', err.stack);
  process.exit(1);
});
server.once('listening', () => {
  console.info('[server] listening ' + port);
});

console.info('[server] listen ' + port);
server.listen(port);

process.once('SIGTERM', () => {
  console.log('[server] server stopped');
  process.exit();
});

console.error('[server] error');
