# Yiyang Fan's Blog

> 我的个人博客 [fanyiyang.top](https://fanyiyang.top) 的源码 — 用 Notion 写作，Next.js 渲染，Vercel 部署。

## 工作方式

- **内容**：全部在 Notion 里编辑（根页面见 [`site.config.ts`](./site.config.ts) 的 `rootNotionPageId`）。改动约 10 秒内自动同步到网站，无需部署。
- **代码**：合并到 `main` 分支后，Vercel 自动构建并发布到 [fanyiyang.top](https://fanyiyang.top)。
- **站点配置**：站名、域名、社交账号等都集中在 [`site.config.ts`](./site.config.ts)。

## 本地开发

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # eslint + prettier
```

Node 版本以 [`.nvmrc`](./.nvmrc) 为准。

## 特性

- 浏览器标签页图标自动跟随各页面的 Notion icon（emoji 或图片）
- 页面按需生成（ISR），构建不受 Notion API 限流影响
- 自动生成社交分享图、RSS（[/feed](https://fanyiyang.top/feed)）、sitemap
- 深色模式、⌘K 站内搜索

## 致谢

基于 [transitive-bullshit/nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit) 构建，MIT License。
