/**
 * @file proxy.ts
 * @description 通用反向代理路由，把所有请求转发到 PROXY_TARGET 指定的上游
 */

import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';

const router = express.Router();

/** 上游地址，由环境变量注入，未配置时直接启动失败而不是静默转发到错误目标 */
const target = process.env.PROXY_TARGET;

/** 预检请求直接放行，避免上游返回 405 */
router.options('*', (req, res) => res.sendStatus(204));

router.use(
    '/',
    createProxyMiddleware({
        target,
        changeOrigin: true,
        /** http-proxy-middleware v3 起回调需挂在 on 上，v2 的 onProxyRes 顶层写法已失效 */
        on: {
            /** 统一补齐跨域响应头，让浏览器端可以直接调用上游接口 */
            proxyRes: (proxyRes, req, res) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
                res.removeHeader('X-Frame-Options');
            },
        },
    })
);

export default router;
