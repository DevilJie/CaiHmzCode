# 技术分享网站开发计划

**版本**: 1.0
**日期**: 2026-03-07
**基于设计文档**: [2026-03-07-tech-share-website-design.md](./2026-03-07-tech-share-website-design.md)

---

## 1. 项目概述

### 1.1 技术栈
- **后端**: Spring Boot 3.2.x + Java 21 + MyBatis-Plus + Redis + JWT
- **前端**: Next.js 14 + React 18 + Creative Tim UI + Tailwind CSS
- **数据库**: MySQL 8.0
- **缓存**: Redis 7.0

### 1.2 模块划分
| 模块 | 功能 | 优先级 |
|------|------|--------|
| 基础架构 | 项目初始化、数据库、认证 | P0 |
| 项目展示 | 项目卡片、详情、README同步 | P0 |
| 技术博客 | 博客CRUD、Markdown渲染 | P0 |
| 用户反馈 | 反馈表单、打赏页面 | P1 |
| 广告系统 | 轮播、弹窗广告 | P1 |
| 系统设置 | 配置管理、用户管理 | P1 |

---

## 2. 开发阶段

### 阶段1：基础架构（P0）

#### 1.1 后端项目初始化
**任务ID**: BE-001
**描述**: 创建Spring Boot项目，配置基础依赖

**开发内容**:
- [ ] 创建Spring Boot 3.2.x项目（Java 21）
- [ ] 配置pom.xml依赖：
  - spring-boot-starter-web
  - spring-boot-starter-security
  - mybatis-plus-spring-boot3-starter
  - spring-boot-starter-data-redis
  - spring-boot-starter-cache
  - jjwt-api, jjwt-impl, jjwt-jackson
  - lombok
  - spring-boot-starter-validation
- [ ] 配置application.yml（开发/生产环境分离）
- [ ] 创建统一响应结构 Result<T>
- [ ] 创建全局异常处理器 GlobalExceptionHandler
- [ ] 配置MyBatis-Plus分页插件
- [ ] 配置Redis序列化

**验收标准**:
- 项目可正常启动
- 访问 /actuator/health 返回健康状态

---

#### 1.2 数据库初始化
**任务ID**: DB-001
**描述**: 创建所有数据库表

**开发内容**:
- [ ] 创建数据库 `tech_share`
- [ ] 执行建表SQL（按设计文档顺序）:
  - t_user（用户表）
  - t_project（项目表）
  - t_project_readme（README缓存表）
  - t_blog_category（博客分类表）
  - t_blog_tag（博客标签表）
  - t_blog（博客表）
  - t_blog_tag_relation（博客标签关联表）
  - t_feedback（意见反馈表）
  - t_donation_qrcode（收款码表）
  - t_advertisement（广告表）
  - t_system_config（系统配置表）
- [ ] 插入初始化数据：
  - 超级管理员账号（admin/admin123）
  - 系统配置默认值

**验收标准**:
- 所有表创建成功
- 初始数据插入正确

---

#### 1.3 JWT认证模块
**任务ID**: BE-002
**描述**: 实现JWT认证机制

**开发内容**:
- [ ] 创建JwtUtil工具类（生成/解析/验证Token）
- [ ] 创建JwtAuthenticationFilter过滤器
- [ ] 配置Spring Security：
  - 开放用户端API
  - 保护管理端API
  - 配置CORS
- [ ] 创建认证相关DTO：
  - LoginRequest
  - LoginResponse
  - UserProfileResponse
- [ ] 创建AuthController：
  - POST /api/v1/admin/auth/login
  - POST /api/v1/admin/auth/logout
  - GET /api/v1/admin/auth/profile
  - PUT /api/v1/admin/auth/profile
  - PUT /api/v1/admin/auth/password

**验收标准**:
- 登录成功返回JWT Token
- 携带Token可访问管理端API
- Token过期自动返回401

---

#### 1.4 文件上传模块
**任务ID**: BE-003
**描述**: 实现本地文件上传

**开发内容**:
- [ ] 创建FileUploadService
- [ ] 配置文件存储路径（application.yml）
- [ ] 实现图片上传接口：
  - POST /api/v1/admin/upload/image
- [ ] 文件类型校验（jpg/png/gif/webp）
- [ ] 文件大小限制（5MB）
- [ ] 文件重命名（UUID）
- [ ] 配置静态资源映射

**验收标准**:
- 可上传图片并返回URL
- 非法文件类型被拒绝
- 超大文件被拒绝

---

#### 1.5 前端项目初始化
**任务ID**: FE-001
**描述**: 创建Next.js项目

**开发内容**:
- [ ] 创建Next.js 14项目（App Router）
- [ ] 安装核心依赖：
  - @creative-tim/ui（或替代UI库）
  - tailwindcss
  - axios
  - @tanstack/react-query
  - react-markdown
  - react-player
  - date-fns
- [ ] 配置tailwind.config.js
- [ ] 配置next.config.js（API代理、图片域名）
- [ ] 创建API客户端（axios实例）
- [ ] 创建React Query Provider
- [ ] 创建通用布局组件：
  - UserLayout（用户端）
  - AdminLayout（管理端）

**验收标准**:
- 项目可正常启动
- 访问首页显示欢迎页面

---

### 阶段2：核心功能（P0）

#### 2.1 项目展示模块 - 后端
**任务ID**: BE-004
**描述**: 实现项目展示API

**开发内容**:
- [ ] 创建Entity：Project, ProjectReadme
- [ ] 创建Mapper：ProjectMapper, ProjectReadmeMapper
- [ ] 创建Service：ProjectService
  - 分页查询项目列表
  - 获取项目详情（含README）
  - 增加浏览次数
- [ ] 创建用户端Controller：
  - GET /api/v1/projects
  - GET /api/v1/projects/{id}
  - POST /api/v1/projects/{id}/view
- [ ] 实现GitHub README同步：
  - GitHubService（调用GitHub API）
  - 定时任务（每天凌晨2点同步）
  - 异常处理（API限流、网络错误）

**验收标准**:
- 项目列表正确返回
- 项目详情包含README内容
- README缓存24小时更新

---

#### 2.2 项目展示模块 - 前端（用户端）
**任务ID**: FE-002
**描述**: 实现项目展示页面

**开发内容**:
- [ ] 首页 `/`：
  - 轮播广告位组件
  - 项目卡片网格（4列）
  - 最新博客列表
- [ ] 项目列表页 `/projects`：
  - 项目卡片展示
  - 分页组件
- [ ] 项目详情页 `/projects/[id]`：
  - 封面图展示
  - 项目信息卡片
  - README渲染（react-markdown）
  - 操作按钮（访问项目、GitHub）
- [ ] 创建组件：
  - ProjectCard
  - ProjectDetail
  - MarkdownRenderer

**验收标准**:
- 项目卡片正确显示
- 项目详情页README渲染正确
- 点击按钮可跳转

---

#### 2.3 项目管理模块 - 后端
**任务ID**: BE-005
**描述**: 实现项目管理API

**开发内容**:
- [ ] 创建DTO：ProjectCreateRequest, ProjectUpdateRequest, ProjectResponse
- [ ] 扩展ProjectService：
  - 管理端分页查询（含搜索）
  - 新增项目
  - 更新项目
  - 删除项目（逻辑删除）
  - 手动同步README
- [ ] 创建管理端Controller：
  - GET /api/v1/admin/projects
  - POST /api/v1/admin/projects
  - PUT /api/v1/admin/projects/{id}
  - DELETE /api/v1/admin/projects/{id}
  - POST /api/v1/admin/projects/{id}/sync-readme

**验收标准**:
- 管理员可CRUD项目
- 手动同步README成功

---

#### 2.4 项目管理模块 - 前端
**任务ID**: FE-003
**描述**: 实现项目管理页面

**开发内容**:
- [ ] 项目列表页 `/admin/projects`：
  - 表格展示（名称、简介、状态、操作）
  - 搜索框
  - 分页
  - 新增按钮
- [ ] 项目编辑页 `/admin/projects/edit/[id]`：
  - 表单字段（名称、简介、URL、GitHub、封面、标签、排序、状态）
  - 封面图上传
  - 保存/取消按钮
- [ ] 创建组件：
  - ProjectForm
  - TechTagInput

**验收标准**:
- 可新增/编辑/删除项目
- 表单验证正确
- 图片上传成功

---

#### 2.5 技术博客模块 - 后端
**任务ID**: BE-006
**描述**: 实现博客相关API

**开发内容**:
- [ ] 创建Entity：Blog, BlogCategory, BlogTag, BlogTagRelation
- [ ] 创建Mapper：各实体Mapper
- [ ] 创建Service：BlogService, BlogCategoryService, BlogTagService
  - 博客CRUD
  - 分类CRUD
  - 标签CRUD
  - 发布/取消发布
- [ ] 创建用户端Controller：
  - GET /api/v1/blogs
  - GET /api/v1/blogs/{id}
  - POST /api/v1/blogs/{id}/view
  - GET /api/v1/blog-categories
  - GET /api/v1/blog-tags
- [ ] 创建管理端Controller：
  - GET/POST/PUT/DELETE /api/v1/admin/blogs
  - PUT /api/v1/admin/blogs/{id}/publish
  - PUT /api/v1/admin/blogs/{id}/unpublish
  - 分类和标签管理API

**验收标准**:
- 博客CRUD正常
- 发布状态切换正确
- 标签关联正确

---

#### 2.6 技术博客模块 - 前端（用户端）
**任务ID**: FE-004
**描述**: 实现博客展示页面

**开发内容**:
- [ ] 博客列表页 `/blogs`：
  - 博客卡片列表
  - 分类筛选
  - 标签筛选
  - 分页
- [ ] 博客详情页 `/blogs/[id]`：
  - 标题、元信息
  - 标签展示
  - 视频播放器（如有）
  - Markdown内容渲染
  - 侧边栏（相关博客）
- [ ] 创建组件：
  - BlogCard
  - BlogDetail
  - VideoPlayer
  - TagCloud
  - CategoryFilter

**验收标准**:
- 博客列表筛选正确
- 详情页Markdown渲染正确
- 视频可播放

---

#### 2.7 技术博客模块 - 前端（管理端）
**任务ID**: FE-005
**描述**: 实现博客管理页面

**开发内容**:
- [ ] 博客列表页 `/admin/blogs`：
  - 表格展示
  - 状态筛选（草稿/发布）
  - 搜索
- [ ] 博客编辑页 `/admin/blogs/edit/[id]`：
  - Markdown编辑器（实时预览）
  - 封面图上传
  - 分类选择
  - 标签选择
  - 视频链接输入
  - 发布/保存草稿按钮
- [ ] 分类管理弹窗
- [ ] 标签管理弹窗
- [ ] 创建组件：
  - MarkdownEditor
  - BlogForm

**验收标准**:
- Markdown编辑器正常工作
- 实时预览正确
- 草稿/发布切换正确

---

### 阶段3：扩展功能（P1）

#### 3.1 用户反馈模块 - 后端
**任务ID**: BE-007
**描述**: 实现反馈和收款码API

**开发内容**:
- [ ] 创建Entity：Feedback, DonationQrcode
- [ ] 创建Mapper、Service
- [ ] 创建用户端Controller：
  - POST /api/v1/feedbacks
  - GET /api/v1/donation-qrcodes
- [ ] 创建管理端Controller：
  - GET /api/v1/admin/feedbacks
  - PUT /api/v1/admin/feedbacks/{id}/read
  - DELETE /api/v1/admin/feedbacks/{id}
  - 收款码CRUD

**验收标准**:
- 用户可提交反馈
- 管理员可查看/标记反馈
- 收款码CRUD正常

---

#### 3.2 用户反馈模块 - 前端
**任务ID**: FE-006
**描述**: 实现反馈和打赏页面

**开发内容**:
- [ ] 意见反馈页 `/feedback`：
  - 反馈表单
  - 表单验证
  - 提交成功提示
- [ ] 打赏页 `/donation`：
  - 收款码展示
  - 感谢语
- [ ] 管理端反馈列表页 `/admin/feedbacks`
- [ ] 管理端收款码管理页 `/admin/donations`

**验收标准**:
- 反馈提交成功
- 收款码正确显示
- 管理员可管理反馈

---

#### 3.3 广告系统模块 - 后端
**任务ID**: BE-008
**描述**: 实现广告API

**开发内容**:
- [ ] 创建Entity：Advertisement
- [ ] 创建Mapper、Service
- [ ] 创建用户端Controller：
  - GET /api/v1/advertisements?position=BANNER/POPUP
- [ ] 创建管理端Controller：
  - 广告CRUD
- [ ] 实现定时上下线（检查时间范围）

**验收标准**:
- 广告按位置返回
- 时间范围过滤正确

---

#### 3.4 广告系统模块 - 前端
**任务ID**: FE-007
**描述**: 实现广告展示和管理

**开发内容**:
- [ ] 首页轮播组件（Banner广告）
- [ ] 弹窗广告组件（首次访问弹出）
- [ ] 管理端广告列表页 `/admin/ads`
- [ ] 广告编辑表单

**验收标准**:
- 轮播广告正确展示
- 弹窗广告首次访问显示
- 广告管理正常

---

#### 3.5 系统设置模块 - 后端
**任务ID**: BE-009
**描述**: 实现系统配置和用户管理API

**开发内容**:
- [ ] 创建Entity：SystemConfig
- [ ] 创建SystemConfigService
- [ ] 创建管理端Controller：
  - GET/PUT /api/v1/admin/system/configs
  - 用户CRUD（仅超级管理员）
- [ ] 实现权限拦截（超级管理员专属）

**验收标准**:
- 配置可读写
- 普通管理员无法访问用户管理

---

#### 3.6 系统设置模块 - 前端
**任务ID**: FE-008
**描述**: 实现系统设置页面

**开发内容**:
- [ ] 系统设置页 `/admin/settings`：
  - 网站信息配置
  - GitHub Token配置
- [ ] 用户管理页 `/admin/users`（仅超级管理员可见）：
  - 用户列表
  - 新增/编辑用户
  - 角色分配

**验收标准**:
- 配置保存成功
- 用户管理正常

---

#### 3.7 管理后台仪表盘
**任务ID**: FE-009
**描述**: 实现仪表盘页面

**开发内容**:
- [ ] 仪表盘页 `/admin`：
  - 数据统计卡片（博客数、项目数、访问量）
  - 最新反馈列表
  - 快捷入口
- [ ] 后端统计API：
  - GET /api/v1/admin/dashboard/stats

**验收标准**:
- 统计数据正确
- 快捷入口可用

---

### 阶段4：优化部署（P1）

#### 4.1 前端性能优化
**任务ID**: FE-010
**描述**: 优化前端性能

**开发内容**:
- [ ] 图片懒加载
- [ ] 骨架屏组件
- [ ] React Query缓存优化
- [ ] 代码分割
- [ ] ISR配置（博客详情页）

**验收标准**:
- Lighthouse性能评分>80
- 首屏加载<3秒

---

#### 4.2 SEO优化
**任务ID**: FE-011
**描述**: 优化SEO

**开发内容**:
- [ ] 每页配置metadata（title、description）
- [ ] 生成sitemap.xml
- [ ] 博客页添加JSON-LD结构化数据
- [ ] 配置robots.txt

**验收标准**:
- 页面meta标签正确
- sitemap可访问

---

#### 4.3 部署配置
**任务ID**: DEPLOY-001
**描述**: 配置生产环境部署

**开发内容**:
- [ ] 后端打包配置
- [ ] 前端构建配置
- [ ] Nginx配置文件
- [ ] 生产环境配置文件
- [ ] 启动脚本

**验收标准**:
- 后端服务正常启动
- 前端页面正常访问
- API代理正确

---

## 3. 任务依赖关系

```
阶段1（基础架构）
├── BE-001（后端初始化）──┬──> BE-002（JWT认证）
│                        └──> BE-003（文件上传）
├── DB-001（数据库）──────> 所有后端任务
└── FE-001（前端初始化）──> 所有前端任务

阶段2（核心功能）
├── BE-004（项目展示后端）──> FE-002（项目展示前端）
├── BE-005（项目管理后端）──> FE-003（项目管理前端）
├── BE-006（博客后端）─────┬──> FE-004（博客展示前端）
│                         └──> FE-005（博客管理前端）

阶段3（扩展功能）
├── BE-007（反馈后端）─────> FE-006（反馈前端）
├── BE-008（广告后端）─────> FE-007（广告前端）
├── BE-009（系统后端）─────> FE-008（系统设置前端）
└── FE-009（仪表盘）

阶段4（优化部署）
├── FE-010（性能优化）
├── FE-011（SEO优化）
└── DEPLOY-001（部署配置）
```

---

## 4. 开发优先级

### P0 - 必须完成
| 任务 | 描述 |
|------|------|
| BE-001 ~ BE-006 | 后端基础架构 + 核心功能 |
| FE-001 ~ FE-005 | 前端基础架构 + 核心功能 |
| DB-001 | 数据库初始化 |

### P1 - 重要功能
| 任务 | 描述 |
|------|------|
| BE-007 ~ BE-009 | 扩展功能后端 |
| FE-006 ~ FE-009 | 扩展功能前端 |

### P2 - 优化项
| 任务 | 描述 |
|------|------|
| FE-010 | 性能优化 |
| FE-011 | SEO优化 |
| DEPLOY-001 | 部署配置 |

---

## 5. 技术要点

### 5.1 后端关键点
1. **JWT认证**: 使用jjwt库，Token有效期7天
2. **GitHub API**: 使用RestTemplate或WebClient调用，需配置Token
3. **定时任务**: 使用@Scheduled实现README同步
4. **缓存策略**: Redis缓存热点数据，Spring Cache抽象

### 5.2 前端关键点
1. **Markdown渲染**: react-markdown + remark-gfm
2. **视频播放**: react-player支持多平台
3. **状态管理**: React Query管理服务端状态
4. **ISR**: 使用generateStaticParams预渲染博客页

### 5.3 安全要点
1. **密码加密**: BCrypt加密存储
2. **XSS防护**: 输入内容转义，Markdown渲染时过滤危险标签
3. **CORS**: 严格限制允许的域名
4. **文件上传**: 类型、大小校验

---

## 6. 验收清单

### 功能验收
- [ ] 用户端：首页、项目列表、项目详情、博客列表、博客详情、反馈、打赏
- [ ] 管理端：登录、仪表盘、项目管理、博客管理、反馈管理、广告管理、系统设置
- [ ] 权限：超级管理员/普通管理员权限隔离

### 技术验收
- [ ] 后端API文档完整
- [ ] 前端组件可复用
- [ ] 代码规范（Checkstyle/ESLint）
- [ ] 无明显性能问题

### 部署验收
- [ ] 生产环境配置正确
- [ ] Nginx配置正确
- [ ] HTTPS证书配置
- [ ] 日志记录正常

---

## 7. 风险提示

| 风险 | 应对措施 |
|------|----------|
| GitHub API限流 | 使用Token认证，缓存README内容 |
| Creative Tim UI兼容性 | 预留备选方案（shadcn/ui） |
| 图片存储增长 | 定期清理，预留云存储迁移接口 |

---

## 8. 开始开发

确认开发计划后，按以下顺序开始：

1. **第一步**: DB-001（数据库初始化）
2. **第二步**: BE-001（后端项目初始化）
3. **第三步**: FE-001（前端项目初始化）
4. **后续**: 按依赖关系依次开发

准备好后，告诉我从哪个任务开始！
