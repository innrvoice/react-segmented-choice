import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 6007);
const staticRoot = resolve(process.cwd(), process.env.STATIC_ROOT ?? 'storybook-static');

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function resolveRequestPath(url) {
  const requestUrl = new URL(url, 'http://127.0.0.1');
  const pathname = decodeURIComponent(
    requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname
  );
  const candidatePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(staticRoot, candidatePath);

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return null;
}

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (requestUrl.pathname === '/health') {
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('ok');
    return;
  }

  const filePath = request.url ? resolveRequestPath(request.url) : null;

  if (!filePath) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const contentType = contentTypes.get(extname(filePath)) ?? 'application/octet-stream';
  response.writeHead(200, { 'content-type': contentType });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`storybook-static listening on http://${host}:${port}`);
});
