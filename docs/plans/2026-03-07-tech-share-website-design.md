# 技术分享网站设计文档

**版本**: 1.0
**日期**: 2026-03-07
**状态**: 已确认

---

## 1. 项目概述

### 1.1 项目背景
35岁程序员希望通过技术分享网站积累粉丝，谋求被动收入。网站用于展示AI开发的项目、发布技术博客、收集用户反馈、展示打赏方式。

### 1.2 核心功能
- **项目展示**：卡片方式展示AI开发的项目，支持跳转到项目首页，显示GitHub README
- **技术博客**：Markdown + 外链视频支持
- **用户反馈**：意见反馈表单 + 打赏功能
- **广告系统**：首页轮播、弹窗广告位
- **管理后台**：项目管理、博客管理、广告管理、收款码管理、系统参数配置
- **简单权限**：两级权限（超级管理员 + 普通管理员）

### 1.3 目标用户
- 主要用户：技术爱好者、开发者群体
- 管理员：网站所有者（超级管理员）+ 后期可能的协作者（普通管理员）

---

## 2. 技术选型

### 2.1 方案选择：Spring Boot + Next.js（前后端分离）

**后端技术栈**：
- Spring Boot 3.2.x / Java 21
- MyBatis-Plus（ORM）
- Spring Security + JWT（权限认证）
- Redis（缓存、Session）
- Spring Cache（缓存抽象）
- GitHub API（获取README）
- Lombok（简化代码）

**前端技术栈**：
- Next.js 14（App Router）
- React 18
- Creative Tim UI（组件库）
- Tailwind CSS（样式）
- Axios（HTTP请求）
- React Query（数据缓存）
- React Markdown（Markdown渲染）
- React Player（视频播放）

**基础设施**：
- Nginx（反向代理、静态资源）
- MySQL 8.0（数据库）
- Redis 7.0（缓存）

### 2.2 选择理由
1. **完美支持Creative Tim UI** - 必须使用Next.js环境
2. **SEO友好** - 技术博客需要搜索引擎收录
3. **性能优秀** - Next.js的ISR（增量静态生成）适合博客场景
4. **扩展性好** - 后期可以轻松添加更多功能

---

## 3. 系统架构

### 3.1 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户端                               │
│  首页(轮播广告) / 博客列表(弹窗广告) / 项目展示(卡片)        │
│  博客详情(Markdown) / 项目详情(README) / 意见反馈 / 打赏页面 │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (端口80/443)                       │
│  • 静态资源服务 (Next.js构建产物)                           │
│  • 反向代理 /api/* → 后端服务                               │
│  • SSL终止                                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 14 (App Router)                     │
│  • 服务端渲染 (SSR) / 静态生成 (SSG)                        │
│  • ISR增量静态生成 (博客详情页)                             │
│  • Creative Tim UI 组件库                                   │
│  • Tailwind CSS 样式                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓ REST API
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot 3.2 (端口8080)                     │
│  Controller Layer → Service Layer → Data Layer              │
└─────────────────────────────────────────────────────────────┘
          ↓                        ↓                    ↓
   ┌─────────────┐         ┌─────────────┐      ┌─────────────┐
   │    MySQL    │         │    Redis    │      │  本地存储   │
   │  (数据持久化)│         │  (缓存/Session)│   │  (图片文件) │
   └─────────────┘         └─────────────┘      └─────────────┘
```

### 3.2 部署方式
- 传统部署（非容器化）
- 后端独立部署在端口8080
- 前端构建后由Nginx提供服务
- 支持开发/生产环境配置切换

---

## 4. 功能模块设计

### 4.1 项目展示模块

**用户端功能**：
- 首页卡片展示（项目名称、简介、封面图、技术标签）
- 项目详情页显示：
  - 项目基本信息（名称、简介、GitHub地址、在线地址）
  - GitHub README渲染（从缓存读取，每24小时更新）
  - "访问项目"按钮 → 跳转到项目URL

**管理端功能**：
- 项目列表（分页、搜索）
- 新增/编辑/删除项目
- 字段：项目名称、项目简介、项目URL、GitHub仓库URL、封面图、技术标签、排序权重、是否显示
- 支持手动刷新README缓存

**特殊逻辑**：
- 如果填写了GitHub URL，后端每天自动拉取README并缓存到数据库

### 4.2 技术博客模块

**用户端功能**：
- 博客列表（分页、分类筛选、标签筛选）
- 博客详情页（Markdown渲染、视频嵌入）
- 侧边栏显示：作者信息、相关博客、标签云

**管理端功能**：
- 博客列表（分页、搜索、状态筛选）
- 新增/编辑/删除博客
- Markdown编辑器（实时预览）
- 字段：标题、摘要、内容、分类、标签、封面图、视频链接、发布状态、发布时间

**特殊逻辑**：
- 支持草稿/发布状态
- 发布后支持ISR（增量静态生成）
- 视频链接支持：B站、YouTube、腾讯视频等

### 4.3 用户反馈模块

**用户端功能**：
- 意见反馈表单（姓名、邮箱、QQ号、微信号、反馈内容）
- 打赏页面（展示微信/支付宝收款码）

**管理端功能**：
- 反馈列表（查看、标记已读、删除）
- 收款码管理（上传微信/支付宝收款码）

### 4.4 广告系统模块

**用户端展示**：
- 首页轮播广告（顶部Banner，支持多张轮播）
- 首页弹窗广告（用户首次访问时弹出，可关闭）

**管理端功能**：
- 广告位管理（轮播位、弹窗位）
- 广告内容管理：广告名称、广告图片、跳转链接、展示权重、开始时间、结束时间、展示状态

**特殊逻辑**：
- 支持按时间自动上下线
- 预留广告联盟对接接口

### 4.5 管理后台模块

**整体布局**：
- 左侧导航栏（可折叠）
- 顶部工具栏（用户信息、退出登录）
- 主内容区（卡片式布局）

**功能菜单**：
```
📊 仪表盘
   └─ 数据概览（博客数、项目数、访问量）

📁 内容管理
   ├─ 项目管理
   ├─ 博客管理
   └─ 反馈管理

📢 广告管理
   ├─ 轮播广告
   └─ 弹窗广告

💰 打赏管理
   └─ 收款码管理

⚙️ 系统设置
   ├─ 网站信息（网站名称、ICP备案号）
   ├─ 系统参数（GitHub Token）
   └─ 用户管理（管理员账号）
```

### 4.6 权限模块

**角色定义**：
- **超级管理员**：
  - 所有功能权限
  - 可管理其他管理员账号

- **普通管理员**：
  - 内容管理权限（项目、博客、反馈）
  - 广告管理权限
  - 打赏管理权限
  - **无权**访问：系统设置、用户管理

**认证方式**：
- JWT Token认证
- Token有效期：7天
- 支持记住登录状态

---

## 5. 数据库设计

### 5.1 用户权限相关表

#### t_user（用户表）
```sql
CREATE TABLE t_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（BCrypt加密）',
    nickname VARCHAR(50) COMMENT '昵称',
    email VARCHAR(100) COMMENT '邮箱',
    avatar VARCHAR(500) COMMENT '头像URL',
    role VARCHAR(20) NOT NULL DEFAULT 'ADMIN' COMMENT '角色：SUPER_ADMIN/ADMIN',
    status TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
    last_login_time DATETIME COMMENT '最后登录时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：1已删除 0未删除'
) COMMENT '用户表';
```

### 5.2 项目展示相关表

#### t_project（项目表）
```sql
CREATE TABLE t_project (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '项目ID',
    name VARCHAR(100) NOT NULL COMMENT '项目名称',
    description TEXT COMMENT '项目简介',
    project_url VARCHAR(500) COMMENT '项目在线地址',
    github_url VARCHAR(500) COMMENT 'GitHub仓库地址',
    cover_image VARCHAR(500) COMMENT '封面图URL',
    tech_tags VARCHAR(500) COMMENT '技术标签（JSON数组）',
    sort_order INT DEFAULT 0 COMMENT '排序权重（越大越靠前）',
    is_show TINYINT DEFAULT 1 COMMENT '是否显示：1显示 0隐藏',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：1已删除 0未删除'
) COMMENT '项目表';
```

#### t_project_readme（项目README缓存表）
```sql
CREATE TABLE t_project_readme (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    readme_content LONGTEXT COMMENT 'README内容（Markdown）',
    last_sync_time DATETIME COMMENT '最后同步时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_project_id (project_id)
) COMMENT '项目README缓存表';
```

### 5.3 博客相关表

#### t_blog_category（博客分类表）
```sql
CREATE TABLE t_blog_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    sort_order INT DEFAULT 0 COMMENT '排序权重',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：1已删除 0未删除'
) COMMENT '博客分类表';
```

#### t_blog_tag（博客标签表）
```sql
CREATE TABLE t_blog_tag (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：1已删除 0未删除'
) COMMENT '博客标签表';
```

#### t_blog（博客表）
```sql
CREATE TABLE t_blog (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '博客ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    summary TEXT COMMENT '摘要',
    content LONGTEXT NOT NULL COMMENT '内容（Markdown）',
    category_id BIGINT COMMENT '分类ID',
    cover_image VARCHAR(500) COMMENT '封面图URL',
    video_url VARCHAR(500) COMMENT '视频链接',
    status TINYINT DEFAULT 0 COMMENT '状态：0草稿 1发布',
    publish_time DATETIME COMMENT '发布时间',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：1已删除 0未删除'
) COMMENT '博客表';
```

#### t_blog_tag_relation（博客标签关联表）
```sql
CREATE TABLE t_blog_tag_relation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    blog_id BIGINT NOT NULL COMMENT '博客ID',
    tag_id BIGINT NOT NULL COMMENT '标签ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_blog_tag (blog_id, tag_id)
) COMMENT '博客标签关联表';
```

### 5.4 反馈与打赏相关表

#### t_feedback（意见反馈表）
```sql
CREATE TABLE t_feedback (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '反馈ID',
    name VARCHAR(50) COMMENT '姓名',
    email VARCHAR(100) COMMENT '邮箱',
    qq VARCHAR(20) COMMENT 'QQ号',
    wechat VARCHAR(50) COMMENT '微信号',
    content TEXT NOT NULL COMMENT '反馈内容',
    is_read TINYINT DEFAULT 0 COMMENT '是否已读：1已读 0未读',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：1已删除 0未删除'
) COMMENT '意见反馈表';
```

#### t_donation_qrcode（收款码表）
```sql
CREATE TABLE t_donation_qrcode (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    type VARCHAR(20) NOT NULL COMMENT '类型：WECHAT/ALIPAY',
    name VARCHAR(50) COMMENT '名称（如：微信收款码）',
    qrcode_url VARCHAR(500) NOT NULL COMMENT '收款码图片URL',
    is_show TINYINT DEFAULT 1 COMMENT '是否显示：1显示 0隐藏',
    sort_order INT DEFAULT 0 COMMENT '排序权重',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：1已删除 0未删除'
) COMMENT '收款码表';
```

### 5.5 广告相关表

#### t_advertisement（广告表）
```sql
CREATE TABLE t_advertisement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '广告ID',
    position VARCHAR(20) NOT NULL COMMENT '广告位：BANNER/POPUP',
    name VARCHAR(100) NOT NULL COMMENT '广告名称',
    image_url VARCHAR(500) NOT NULL COMMENT '广告图片URL',
    link_url VARCHAR(500) COMMENT '跳转链接',
    weight INT DEFAULT 1 COMMENT '展示权重（越大越容易展示）',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    status TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除：1已删除 0未删除'
) COMMENT '广告表';
```

### 5.6 系统配置相关表

#### t_system_config（系统配置表）
```sql
CREATE TABLE t_system_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_name VARCHAR(100) COMMENT '配置名称',
    description VARCHAR(500) COMMENT '配置说明',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT '系统配置表';

-- 初始化数据
INSERT INTO t_system_config (config_key, config_value, config_name, description) VALUES
('SITE_NAME', '技术分享站', '网站名称', '网站名称'),
('ICP_NUMBER', '', 'ICP备案号', 'ICP备案号'),
('GITHUB_TOKEN', '', 'GitHub Token', '用于获取GitHub README的Token'),
('FOOTER_TEXT', '© 2024 技术分享站', '页脚文字', '页脚版权信息');
```

---

## 6. API设计

### 6.1 API通用规范

**基础路径**：`/api/v1`

**响应格式**：
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1709798400000
}
```

**状态码规范**：
- 200：成功
- 400：参数错误
- 401：未认证
- 403：无权限
- 404：资源不存在
- 500：服务器错误

**认证方式**：
- Header: `Authorization: Bearer {token}`

### 6.2 用户端API

#### 项目相关
```
GET    /api/v1/projects                    # 项目列表（分页）
GET    /api/v1/projects/{id}               # 项目详情
POST   /api/v1/projects/{id}/view          # 增加浏览次数
```

#### 博客相关
```
GET    /api/v1/blogs                       # 博客列表（分页、分类筛选、标签筛选）
GET    /api/v1/blogs/{id}                  # 博客详情
POST   /api/v1/blogs/{id}/view             # 增加浏览次数
GET    /api/v1/blog-categories             # 分类列表
GET    /api/v1/blog-tags                   # 标签列表
```

#### 反馈与打赏
```
POST   /api/v1/feedbacks                   # 提交反馈
GET    /api/v1/donation-qrcodes            # 获取收款码列表
```

#### 广告相关
```
GET    /api/v1/advertisements              # 获取广告列表（按广告位筛选）
```

#### 系统信息
```
GET    /api/v1/system/info                 # 获取网站信息（名称、ICP备案号等）
```

### 6.3 管理端API

#### 认证相关
```
POST   /api/v1/admin/auth/login            # 登录
POST   /api/v1/admin/auth/logout           # 登出
GET    /api/v1/admin/auth/profile          # 获取当前用户信息
PUT    /api/v1/admin/auth/profile          # 更新当前用户信息
PUT    /api/v1/admin/auth/password         # 修改密码
```

#### 项目管理
```
GET    /api/v1/admin/projects              # 项目列表（分页、搜索）
POST   /api/v1/admin/projects              # 新增项目
PUT    /api/v1/admin/projects/{id}         # 更新项目
DELETE /api/v1/admin/projects/{id}         # 删除项目
POST   /api/v1/admin/projects/{id}/sync-readme  # 手动同步README
```

#### 博客管理
```
GET    /api/v1/admin/blogs                 # 博客列表（分页、搜索、状态筛选）
POST   /api/v1/admin/blogs                 # 新增博客
PUT    /api/v1/admin/blogs/{id}            # 更新博客
DELETE /api/v1/admin/blogs/{id}            # 删除博客
PUT    /api/v1/admin/blogs/{id}/publish    # 发布博客
PUT    /api/v1/admin/blogs/{id}/unpublish  # 取消发布

GET    /api/v1/admin/blog-categories       # 分类列表
POST   /api/v1/admin/blog-categories       # 新增分类
PUT    /api/v1/admin/blog-categories/{id}  # 更新分类
DELETE /api/v1/admin/blog-categories/{id}  # 删除分类

GET    /api/v1/admin/blog-tags             # 标签列表
POST   /api/v1/admin/blog-tags             # 新增标签
PUT    /api/v1/admin/blog-tags/{id}        # 更新标签
DELETE /api/v1/admin/blog-tags/{id}        # 删除标签
```

#### 反馈管理
```
GET    /api/v1/admin/feedbacks             # 反馈列表（分页、已读/未读筛选）
PUT    /api/v1/admin/feedbacks/{id}/read   # 标记已读
DELETE /api/v1/admin/feedbacks/{id}        # 删除反馈
```

#### 收款码管理
```
GET    /api/v1/admin/donation-qrcodes      # 收款码列表
POST   /api/v1/admin/donation-qrcodes      # 新增收款码
PUT    /api/v1/admin/donation-qrcodes/{id} # 更新收款码
DELETE /api/v1/admin/donation-qrcodes/{id} # 删除收款码
```

#### 广告管理
```
GET    /api/v1/admin/advertisements        # 广告列表（分页、广告位筛选）
POST   /api/v1/admin/advertisements        # 新增广告
PUT    /api/v1/admin/advertisements/{id}   # 更新广告
DELETE /api/v1/admin/advertisements/{id}   # 删除广告
```

#### 系统设置（仅超级管理员）
```
GET    /api/v1/admin/system/configs        # 获取系统配置
PUT    /api/v1/admin/system/configs        # 更新系统配置

GET    /api/v1/admin/users                 # 用户列表（仅超级管理员）
POST   /api/v1/admin/users                 # 新增用户（仅超级管理员）
PUT    /api/v1/admin/users/{id}            # 更新用户（仅超级管理员）
DELETE /api/v1/admin/users/{id}            # 删除用户（仅超级管理员）
```

#### 文件上传
```
POST   /api/v1/admin/upload/image          # 上传图片（返回图片URL）
```

### 6.4 API安全设计

**认证机制**：
- JWT Token认证
- Token有效期：7天
- Token刷新机制：剩余有效期<3天时自动刷新

**权限控制**：
- 基于角色的权限控制（RBAC）
- 超级管理员：所有权限
- 普通管理员：内容管理权限（无系统设置权限）

**接口防护**：
- 登录接口：频率限制（5次/分钟）
- 文件上传：文件类型校验、大小限制（5MB）
- SQL注入防护：使用MyBatis-Plus参数化查询
- XSS防护：输入内容转义

**CORS配置**：
```
允许域名：前端域名（开发/生产环境）
允许方法：GET, POST, PUT, DELETE
允许头部：Authorization, Content-Type
```

---

## 7. 前端设计

### 7.1 页面结构

#### 用户端页面
```
/                           # 首页（轮播广告 + 项目卡片 + 最新博客）
/projects                   # 项目列表页
/projects/[id]              # 项目详情页
/blogs                      # 博客列表页
/blogs/[id]                 # 博客详情页
/feedback                   # 意见反馈页
/donation                   # 打赏页
```

#### 管理端页面
```
/admin/login                # 登录页
/admin                      # 仪表盘
/admin/projects             # 项目管理
/admin/projects/edit/[id]   # 项目编辑
/admin/blogs                # 博客管理
/admin/blogs/edit/[id]      # 博客编辑
/admin/feedbacks            # 反馈管理
/admin/donations            # 收款码管理
/admin/ads                  # 广告管理
/admin/settings             # 系统设置
/admin/users                # 用户管理（仅超级管理员）
```

### 7.2 核心页面设计

#### 首页布局
- 固定顶部导航栏
- 轮播广告位
- 项目卡片展示区（4列布局）
- 最新博客列表
- 页脚（ICP备案号）

#### 项目详情页
- 全宽封面图
- 项目名称 + 技术标签
- 项目简介
- GitHub README渲染区域
- 操作按钮（访问项目、GitHub仓库）

#### 博客详情页
- 标题 + 元信息（作者、日期、阅读数）
- 标签
- 视频播放器（如果有）
- Markdown内容渲染
- 相关博客推荐

### 7.3 管理后台设计

#### 整体布局
- 左侧导航栏（可折叠）
- 顶部工具栏（用户信息、退出登录）
- 主内容区（卡片式布局）

#### 设计风格
- **卡片式布局**：每个功能模块使用卡片包裹，带阴影和圆角
- **简洁配色**：主色调蓝色（#3B82F6），辅助灰色
- **充足留白**：避免拥挤感，提升可读性
- **响应式设计**：支持移动端访问

### 7.4 用户体验优化

#### 首屏性能优化
- **ISR增量静态生成**：首页、博客详情页预渲染
- **图片懒加载**：滚动到可视区域才加载图片
- **骨架屏**：加载时显示占位骨架，避免白屏

#### 交互优化
- **平滑滚动**：页面滚动平滑过渡
- **加载动画**：按钮点击后显示loading状态
- **Toast提示**：操作成功/失败后的友好提示
- **确认对话框**：删除等危险操作前二次确认

#### SEO优化
- **元信息优化**：每页设置独特的title、description
- **结构化数据**：博客文章添加JSON-LD结构化数据
- **站点地图**：自动生成sitemap.xml
- **语义化HTML**：使用正确的HTML标签

#### 移动端适配
- **响应式布局**：支持手机、平板、桌面端
- **触摸友好**：按钮、链接足够大，易于点击
- **简化导航**：移动端使用汉堡菜单

### 7.5 前端技术栈详细配置

#### Next.js配置
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['localhost', 'your-domain.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};
```

#### 关键依赖
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@creative-tim/ui": "latest",
    "tailwindcss": "3.x",
    "axios": "1.x",
    "@tanstack/react-query": "5.x",
    "react-markdown": "9.x",
    "react-player": "2.x",
    "date-fns": "3.x"
  }
}
```

---

## 8. 风险与应对

### 8.1 技术风险

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| GitHub API限流 | README无法同步 | 后端缓存 + Token认证提高限额 |
| 图片存储增长 | 磁盘空间不足 | 图片压缩 + 定期清理 + 预留S3迁移接口 |
| Redis宕机 | 缓存失效 | 降级到数据库查询 + 持久化配置 |

### 8.2 业务风险

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| 广告点击率低 | 被动收入不达预期 | 优化广告位布局 + 接入广告联盟 |
| 内容更新频率低 | 用户粘性不足 | 建立内容发布计划 + RSS订阅功能 |
| SEO排名低 | 流量不足 | 持续优化SEO + 社交媒体推广 |

---

## 9. 环境配置

### 9.1 开发环境

**数据库**：
- IP: 192.168.31.7
- 端口: 3306
- 用户名: root
- 密码: caijie888***

**Redis**：
- IP: 192.168.31.7
- 端口: 6379
- 密码: 111111

**GitHub Token**：
- Token: 

### 9.2 生产环境

**待用户提供**：
- 数据库连接信息
- Redis连接信息
- 服务器SSH信息
- 域名和SSL证书

---

## 10. 里程碑计划

### 阶段1：基础架构（预计2-3天）
- 后端项目初始化
- 数据库表创建
- 基础配置（环境变量、Redis、文件上传）

### 阶段2：核心功能（预计5-7天）
- 用户端：项目展示、博客展示
- 管理端：项目管理、博客管理
- GitHub README同步

### 阶段3：扩展功能（预计3-4天）
- 用户反馈 + 打赏
- 广告系统
- 系统配置

### 阶段4：优化部署（预计2-3天）
- 前端性能优化
- SEO优化
- 部署到生产环境

---

## PM Handoff Complete
- PRD Version: 1.0
- Ready for TL Review: ✅
- Context Reset Recommended: Yes
