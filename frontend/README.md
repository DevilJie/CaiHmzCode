# 技术分享站 - 前端项目

基于 Next.js 14 (App Router) + React 18 + Tailwind CSS 构建的技术分享网站前端。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: React 18 + Tailwind CSS
- **HTTP客户端**: Axios
- **数据缓存**: @tanstack/react-query
- **Markdown渲染**: react-markdown
- **视频播放**: react-player
- **日期处理**: date-fns

## 开发环境

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   ├── providers.tsx       # React Query Provider
│   │   ├── globals.css         # 全局样式
│   │   ├── (user)/             # 用户端路由组
│   │   │   ├── layout.tsx      # 用户端布局
│   │   │   ├── projects/       # 项目列表页
│   │   │   ├── blogs/          # 博客列表页
│   │   │   ├── feedback/       # 意见反馈页
│   │   │   └── donation/       # 打赏页面
│   │   └── admin/              # 管理后台
│   │       ├── layout.tsx      # 管理端布局
│   │       ├── page.tsx        # 仪表盘
│   │       └── login/          # 登录页
│   ├── components/             # 组件
│   │   ├── layout/             # 布局组件
│   │   └── ui/                 # UI组件
│   ├── lib/                    # 工具库
│   │   ├── axios.ts            # Axios实例
│   │   └── queryClient.ts      # React Query配置
│   └── types/                  # TypeScript类型定义
│       └── index.ts
├── public/                     # 静态资源
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## API代理配置

开发环境下，`/api/*` 请求会自动代理到后端 `http://localhost:8080`。

详见 `next.config.js` 中的 `rewrites` 配置。

## 后端API

后端API地址: http://localhost:8080

API文档详见设计文档。
