import express from 'express';
import bodyParser from 'body-parser';

import proxy from './controller/proxy';

/** 监听端口，可用 PORT 覆盖 */
const port = Number(process.env.PORT) || 8989;

/** 上游地址缺失时优先报错，避免带着 undefined target 起一个不可用的服务 */
if (!process.env.PROXY_TARGET) {
    console.error('PROXY_TARGET is required, e.g. PROXY_TARGET=https://example.com bun start');
    process.exit(1);
}

// 创建express应用
const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 信任代理
app.set('trust proxy', true);

// 打印请求日志
const loggerMiddleware = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    console.log(`[${req.ip}] ${req.method} ${req.path}`);
    next();
};
app.use(loggerMiddleware);

app.use('/', proxy);

app.listen(port, () => {
    console.log(`Server is running on port ${port}, proxying to ${process.env.PROXY_TARGET}`);
});
