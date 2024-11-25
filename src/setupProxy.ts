import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app: any) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://blastapi.io",
      changeOrigin: true,
    })
  );
};
