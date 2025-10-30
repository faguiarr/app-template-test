import express, { Request, Response, NextFunction } from 'express';
import type { ClientRequest, IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';

const PORT = 3200;
const TARGET = process.env.APP_TEMPLATE_SERVER_TARGET_URL;

if (!TARGET) {
  throw new Error('PROXY_SERVER_TARGET_URL must be set.');
}

const app = express();

const onProxyReq = (proxyReq: ClientRequest, req: Request, _res: Response) => {
  const ACCOUNT_SID = process.env.APP_TEMPLATE_ACCOUNT_SID;
  const AUTH_TOKEN = process.env.APP_TEMPLATE_AUTH_TOKEN;

  proxyReq.removeHeader('origin');
  proxyReq.removeHeader('referer');

  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    console.warn(
      'No ACCOUNT_SID or AUTH_TOKEN provided. Requests will be proxied without Authorization.'
    );
    return;
  }

  proxyReq.setHeader('Authorization', `Bearer ${ACCOUNT_SID}:${AUTH_TOKEN}`);
};

const onProxyRes = (proxyRes: IncomingMessage, req: Request, _res: Response) => {
  const origin = req.headers.origin as string | undefined;
  const headersToStrip: string[] = [
    'access-control-allow-origin',
    'access-control-allow-credentials',
    'access-control-expose-headers',
    'access-control-allow-headers',
    'access-control-allow-methods',
    'vary',
  ];

  headersToStrip.forEach((header: string) => {
    delete proxyRes.headers?.[header];
  });

  if (origin) {
    proxyRes.headers['access-control-allow-origin'] = origin;
    proxyRes.headers['vary'] = 'Origin';
    proxyRes.headers['access-control-allow-credentials'] = 'true';
  } else {
    proxyRes.headers['access-control-allow-origin'] = '*';
  }

  proxyRes.headers['access-control-expose-headers'] = 'Content-Type, Authorization, X-Requested-With';
};

const proxyMiddleware = createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  xfwd: true,
  on: {
    proxyReq: onProxyReq,
    proxyRes: onProxyRes,
  },
});

app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {

    const origin = (req.headers.origin as string | undefined) ?? '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

    const reqHeaders = req.headers['access-control-request-headers'] as string | undefined;
    res.setHeader('Access-Control-Allow-Headers', reqHeaders ?? 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    return res.status(204).end();
  }

  next();
});

app.use('/api', proxyMiddleware);

app.listen(PORT, () => {
  console.log(`Dev proxy running on http://localhost:${PORT}`);
  console.log(`Forwarding /api/* to ${TARGET}`);
});
