import { createProxyMiddleware } from 'http-proxy-middleware';

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error('Переменная окружения API_URL не задана!');
}

const proxy = createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  },
  logLevel: 'debug'
});

export default (req, res) => {
  console.log(`[Proxy] Запрос к: ${req.url} -> ${API_URL}${req.url}`);
  return proxy(req, res);
};
