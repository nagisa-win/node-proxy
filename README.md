# node-proxy

一个极简的 CORS 反向代理。基于 Bun + Express + `http-proxy-middleware`，把收到的全部请求原样转发到 `PROXY_TARGET` 指定的上游，并在响应上补齐跨域头。适合本地开发时绕过第三方接口的 CORS 限制。

## 特性

- 全路径透传：`app.all('*')` 交给代理中间件，查询串、请求体、请求头按原样转发
- 自动补齐 `Access-Control-Allow-Origin` / `Allow-Methods` / `Allow-Headers` 与凭证头
- 预检请求由代理自身返回 `204`，不回源
- 请求日志带客户端 IP，`trust proxy` 已开启，可透传反向代理后的真实 IP
- 上游地址与端口全部走环境变量，不硬编码

## 运行

```bash
bun install
PROXY_TARGET=https://example.com bun start
```

可选环境变量：

- `PROXY_TARGET`（必填）上游地址，例如 `https://example.com`
- `PORT` 监听端口，默认 `8989`

## 验证

```bash
curl -i http://127.0.0.1:8989/anything?x=1
```

响应头里应能看到 `Access-Control-Allow-Origin: *`，内容来自上游。

## 注意

- 这是开发期工具，跨域全开（`*` + credentials），不要直接暴露在公网
- 上游地址为运行时注入，中间人风险由使用方自行评估

## License

MIT
