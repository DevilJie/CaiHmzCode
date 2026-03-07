# 技术分享站 - Tech Share

一个现代化的技术分享网站，支持项目展示、技术博客、用户反馈等功能。

## 项目简介

这是一个基于 **Spring Boot 3.2.5 + Next.js 14** 的全栈项目，采用前后端分离架构，提供完整的内容管理系统。

## 技术栈

### 后端
- **框架**: Spring Boot 3.2.5 + Java 21
- **ORM**: MyBatis-Plus 3.5.5
- **认证**: Spring Security + JWT
- **API文档**: SpringDoc OpenAPI (Swagger)
- **缓存**: Redis
- **数据库**: MySQL 8.0

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **UI库**: Tailwind CSS
- **状态管理**: React Query
- **Markdown**: react-markdown + remark-gfm
- **视频播放**: react-player

## 功能特性

### 用户端
- 首页展示（轮播广告 + 项目卡片 + 最新博客）
- 项目展示（列表 + 详情 + GitHub README渲染）
- 技术博客（列表 + 详情 + 分类/标签筛选 + 视频播放）
- 意见反馈
- 打赏页面（微信/支付宝收款码）
- 弹窗广告

### 管理端
- 登录认证（JWT Token）
- 仪表盘（统计数据 + 快捷入口）
- 项目管理（CRUD + README同步）
- 博客管理（CRUD + Markdown编辑器 + 分类/标签管理）
- 反馈管理（列表 + 标记已读 + 删除）
- 收款码管理
- 广告管理（轮播/弹窗 + 启用/禁用）
- 系统设置（网站配置 + GitHub Token）
- 用户管理（仅超级管理员可访问）

### 技术特性
- 两级权限（超级管理员 / 普通管理员）
- GitHub README自动同步（每天凌晨2点）
- Redis缓存
- 文件上传（本地存储，5MB限制）
- Markdown渲染（GFM支持）
- 响应式设计（移动端适配）

## 目录结构

```
.
├── backend/                 # 后端项目
│   ├── src/main/java/
│   │   └── com/aifactory/techshare/
│   │       ├── common/        # 通用类 (Result, PageResult, ResultCode)
│   │       ├── config/        # 配置类 (Redis, Security, OpenApi, WebMvc)
│   │       ├── controller/    # 控制器
│   │       │   └── admin/     # 管理端控制器
│   │       ├── dto/           # 数据传输对象
│   │       ├── entity/        # 实体类
│   │       ├── exception/     # 异常处理
│   │       ├── mapper/        # MyBatis Mapper
│   │       ├── security/      # 安全相关 (JWT过滤器)
│   │       ├── service/       # 业务逻辑层
│   │       └── task/          # 定时任务
│   └── src/main/resources/
│       └── application.yml    # 配置文件
│
├── frontend/                # 前端项目
│   ├── src/app/             # 页面
│   │   ├── (user)/          # 用户端页面
│   │   └── admin/           # 管理端页面
│   ├── components/          # 组件
│   │   ├── admin/           # 管理端组件
│   │   ├── blog/            # 博客相关
│   │   ├── layout/          # 布局组件
│   │   ├── project/         # 项目相关
│   │   └── ui/              # 通用UI组件
│   ├── contexts/            # React Context
│   ├── hooks/               # 自定义Hooks
│   ├── lib/                 # 工具函数
│   ├── services/            # API服务
│   └── types/               # TypeScript类型定义
│
└── docs/                    # 文档
    ├── features/            # 功能开发文档
    └── plans/               # 设计文档
```

## 快速开始

### 环境要求
- Node.js 18+
- Java 21
- MySQL 8.0
- Redis 7.0

### 后端启动

```bash
# 进入后端目录
cd backend

# 安装依赖
mvn install

# 启动服务
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动

### 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 `http://localhost:3000` 启动

## 环境配置

### 后端配置 (application.yml)

```yaml
# 数据库配置
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tech_share
    username: root
    password: your_password

# Redis配置
  data:
    redis:
      host: localhost
      port: 6379
      password: your_redis_password

# JWT配置
jwt:
  secret: your-jwt-secret-key
  expiration: 604800000  # 7天
  header: Authorization
  prefix: Bearer

# 文件上传配置
file:
  upload:
    path: /path/to/uploads
    max-size: 5242880  # 5MB
    allowed-image-types: jpg,jpeg,png,gif,webp
```

### 前端配置 (.env.local)

```env
# 后端API地址
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## API 文档

### Swagger UI

项目集成了 SpringDoc OpenAPI，提供完整的 API 文档。

启动后端服务后，访问以下地址：

| 文档类型 | 地址 |
|---------|------|
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **OpenAPI JSON** | http://localhost:8080/v3/api-docs |
| **OpenAPI YAML** | http://localhost:8080/v3/api-docs.yaml |

### 认证说明

- **用户端接口**：无需认证，可直接测试
- **管理端接口**：需要 JWT Token 认证
  1. 先调用登录接口获取 Token
  2. 点击 Swagger UI 右上角 "Authorize" 按钮
  3. 输入 `Bearer {your_token}` 格式的认证信息

### API 接口概览

#### 用户端接口 (无需认证)

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/v1/projects` | GET | 获取项目列表 |
| `/api/v1/projects/{id}` | GET | 获取项目详情 |
| `/api/v1/blogs` | GET | 获取博客列表 |
| `/api/v1/blogs/{id}` | GET | 获取博客详情 |
| `/api/v1/blog-categories` | GET | 获取分类列表 |
| `/api/v1/blog-tags` | GET | 获取标签列表 |
| `/api/v1/feedbacks` | POST | 提交反馈 |
| `/api/v1/donation-qrcodes` | GET | 获取收款码 |
| `/api/v1/advertisements` | GET | 获取广告 |

#### 管理端接口 (需要认证)

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/v1/admin/auth/login` | POST | 登录 |
| `/api/v1/admin/auth/profile` | GET | 获取当前用户信息 |
| `/api/v1/admin/projects` | GET/POST/PUT/DELETE | 项目管理 |
| `/api/v1/admin/blogs` | GET/POST/PUT/DELETE | 博客管理 |
| `/api/v1/admin/blog-categories` | GET/POST/PUT/DELETE | 分类管理 |
| `/api/v1/admin/blog-tags` | GET/POST/PUT/DELETE | 标签管理 |
| `/api/v1/admin/feedbacks` | GET | 反馈管理 |
| `/api/v1/admin/advertisements` | GET/POST/PUT/DELETE | 广告管理 |
| `/api/v1/admin/donation-qrcodes` | GET/POST/PUT/DELETE | 收款码管理 |
| `/api/v1/admin/system-configs` | GET/PUT | 系统配置 |
| `/api/v1/admin/users` | GET/POST/PUT/DELETE | 用户管理 |
| `/api/v1/admin/dashboard/stats` | GET | 仪表盘统计 |
| `/api/v1/admin/upload` | POST | 文件上传 |

## 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 超级管理员 |

## 常见问题

### 登录错误：用户名或密码错误

请检查：
1. 后端是否正常运行
2. 数据库是否正确初始化
3. 用户名密码是否正确 (默认: admin/admin123)

### 端口被占用

```bash
# Windows
netstat -ano | findstr :8080
taskkill /F /PID {pid}

# Linux/Mac
lsof -i :8080
kill -9 {pid}
```

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

## 作者

- CaiHmzCode

## 贡献

欢迎提交 Issue 和 Pull Request！
