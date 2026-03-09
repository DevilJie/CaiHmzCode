# 系统配置增强与用户体验优化 PRD

## 文档信息

| 项目 | 内容 |
|------|------|
| 版本 | 1.0 |
| 创建日期 | 2026-03-09 |
| 状态 | 待开发 |

---

## 一、背景与目标

### 1.1 背景

当前系统存在以下问题：
1. 系统配置（网站名称、Logo等）在用户端未生效，前端使用硬编码值
2. 用户端导航无法通过管理端配置控制
3. 分类管理功能不够完善，不支持多级分类
4. 缺少主题切换功能，无法满足用户个性化需求

### 1.2 目标

- 实现系统配置在用户端的实时生效（SSR方式）
- 提供灵活的导航配置能力
- 支持多级分类管理
- 提升用户体验（主题切换、布局切换）

---

## 二、需求清单

| # | 需求 | 类型 | 优先级 |
|---|------|------|--------|
| 1 | 上传功能500错误 | Bug | ✅ 已修复 |
| 2 | 系统配置在用户端未生效 | Bug | P0 |
| 3 | 收款码赞助功能开关 | 新功能 | P1 |
| 4 | Logo配置（图片/文字） | 新功能 | P1 |
| 5 | 用户端导航可配置 | 新功能 | P1 |
| 6 | 移除管理后台入口 | UI调整 | P0 |
| 7 | 博客页面：标签放分类下 | UI调整 | P2 |
| 8 | 多级分类（无限层级） | 新功能 | P1 |
| 9 | 博客列表布局切换 | 新功能 | P2 |
| 10 | 日间/夜间模式切换 | 新功能 | P2 |

---

## 三、功能详细设计

### 3.1 系统配置SSR（P0）

#### 3.1.1 后端改动

**新增配置项（system_config 表）：**

| 配置键 | 配置名 | 默认值 | 描述 |
|--------|--------|--------|------|
| `SITE_NAME` | 网站名称 | 技术分享站 | 用于Logo文字显示 |
| `LOGO_TYPE` | Logo类型 | text | text 或 image |
| `LOGO_IMAGE_URL` | Logo图片地址 | - | 当LOGO_TYPE=image时使用 |
| `DONATION_ENABLED` | 打赏功能开关 | true | true 或 false |
| `NAV_HOME_ENABLED` | 首页导航 | true | true 或 false |
| `NAV_PROJECTS_ENABLED` | 项目导航 | true | true 或 false |
| `NAV_BLOGS_ENABLED` | 博客导航 | true | true 或 false |
| `NAV_FEEDBACK_ENABLED` | 反馈导航 | true | true 或 false |
| `NAV_DONATION_ENABLED` | 打赏导航 | true | true 或 false |

**接口设计：**

```
GET /api/v1/system/info
Response: {
  siteName: string,
  icpNumber: string,
  footerText: string,
  logoType: 'text' | 'image',
  logoImageUrl: string,
  donationEnabled: boolean,
  navConfig: {
    home: boolean,
    projects: boolean,
    blogs: boolean,
    feedback: boolean,
    donation: boolean
  }
}
```

#### 3.1.2 前端改动

- 用户端布局通过 SSR 获取系统配置
- `Navbar` 组件根据配置动态渲染导航项
- 移除硬编码的"管理后台"入口

### 3.2 Logo配置（P1）

#### 3.2.1 功能描述

- 支持两种Logo显示方式：文字Logo 和 图片Logo
- 文字Logo：保留渐变色方块图标 + 可配置文字
- 图片Logo：显示上传的图片

#### 3.2.2 管理端UI

在"系统设置"页面新增：
- Logo类型选择（单选：文字/图片）
- Logo图片上传（当选择图片时显示）
- 网站名称输入（当选择文字时显示）

### 3.3 导航配置（P1）

#### 3.3.1 功能描述

- 管理端可控制各导航项的显示/隐藏
- 打赏导航同时受"打赏功能开关"控制
- 配置实时生效（SSR）

#### 3.3.2 管理端UI

在"系统设置"页面新增"导航设置"区域：
- 各导航项的开关控件
- 实时预览效果

### 3.4 打赏功能开关（P1）

#### 3.4.1 功能描述

- 关闭时，用户端不显示"打赏"导航项
- 关闭时，打赏页面返回404或重定向

### 3.5 多级分类（P1）

#### 3.5.1 数据库设计

**blog_category 表新增字段：**

| 字段 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `parent_id` | BIGINT | NULL | 父分类ID，顶级为NULL |
| `level` | INT | 0 | 层级深度，顶级为0 |
| `sort_order` | INT | 0 | 同级排序 |

#### 3.5.2 接口设计

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/v1/blog-categories/tree` | GET | 获取分类树 |
| `/api/v1/blog-categories/leaves` | GET | 获取所有末级分类 |
| `/api/v1/admin/blog-categories` | POST | 创建分类 |
| `/api/v1/admin/blog-categories/{id}` | PUT | 更新分类 |
| `/api/v1/admin/blog-categories/{id}` | DELETE | 删除分类 |

#### 3.5.3 业务规则

- 文章只能关联末级分类（没有子分类的分类）
- 删除分类前需检查是否有子分类或关联文章
- 支持分类排序

#### 3.5.4 管理端UI

- 分类管理页面展示树形结构
- 支持添加子分类
- 支持拖拽排序（可选）

### 3.6 主题切换（P2）

#### 3.6.1 功能描述

- 支持日间/夜间模式切换
- 用户偏好保存到 localStorage
- 使用 Tailwind CSS dark: 前缀实现

#### 3.6.2 技术方案

- 使用 `next-themes` 库管理主题状态
- 在 `layout.tsx` 添加 ThemeProvider
- 在 Navbar 添加主题切换按钮

### 3.7 布局切换（P2）

#### 3.7.1 功能描述

- 博客列表支持两种布局：
  - 列表视图：一行一个
  - 卡片视图：一行四个
- 用户偏好保存到 localStorage

### 3.8 博客页面优化（P2）

- 标签筛选区域移到分类筛选下方
- 调整布局使筛选区域更紧凑

---

## 四、文件变更清单

### 4.1 后端文件

```
backend/src/main/java/com/aifactory/techshare/
├── entity/BlogCategory.java            # 新增 parent_id, level, sort_order
├── service/SystemConfigService.java    # 新增配置键
├── service/BlogCategoryService.java    # 多级分类逻辑
├── controller/BlogCategoryController.java # 分类树接口
├── controller/admin/AdminBlogController.java # 分类CRUD
├── dto/SiteInfoResponse.java           # 新增字段
├── dto/SystemConfigRequest.java        # 新增字段
├── dto/CategoryTreeResponse.java       # 分类树DTO
└── mapper/BlogCategoryMapper.xml       # 递归查询

backend/src/main/resources/
└── db/migration/                        # 数据库迁移脚本
```

### 4.2 前端文件

```
frontend/src/
├── app/(user)/blogs/page.tsx           # 标签位置+布局切换
├── app/(user)/layout.tsx               # 主题Provider
├── app/admin/blogs/categories/page.tsx # 分类树管理页面
├── components/layout/Navbar.tsx        # 动态导航+移除管理入口
├── components/layout/ThemeToggle.tsx   # 主题切换组件
├── components/blog/BlogList.tsx        # 布局切换
├── components/blog/CategoryTree.tsx    # 分类树组件
├── contexts/ThemeContext.tsx           # 主题上下文
├── services/system.ts                  # 用户端配置服务
├── app/admin/settings/page.tsx         # 新增配置项UI
└── types/index.ts                      # 类型更新
```

---

## 五、实现计划

### 5.1 阶段划分

| 阶段 | 内容 | 预计工时 |
|------|------|----------|
| P0 | 系统配置SSR + 移除管理入口 | 2h |
| P1 | Logo配置 + 导航配置 + 打赏开关 + 多级分类 | 4h |
| P2 | 主题切换 + 布局切换 + 博客标签位置 | 2h |

### 5.2 依赖关系

- P1 依赖 P0（配置SSR生效后才能实现配置功能）
- P2 相对独立，可与 P1 并行开发

---

## 六、验收标准

### 6.1 P0 验收标准

- [ ] 用户端能正确显示管理端配置的网站名称
- [ ] 用户端导航栏不再显示"管理后台"入口
- [ ] 配置变更后，刷新页面即可生效

### 6.2 P1 验收标准

- [ ] 管理端可切换Logo类型（文字/图片）
- [ ] 图片Logo能正确上传和显示
- [ ] 各导航项可通过管理端控制显示/隐藏
- [ ] 打赏功能关闭后，用户端不显示打赏导航
- [ ] 分类支持无限层级
- [ ] 文章只能关联末级分类
- [ ] 分类管理页面正常工作

### 6.3 P2 验收标准

- [ ] 主题切换功能正常，刷新页面保持用户选择
- [ ] 博客列表布局切换功能正常
- [ ] 标签筛选区域位置正确

---

## 七、风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 多级分类数据迁移 | 高 | 提供迁移脚本，现有分类自动设为顶级 |
| 主题切换样式遗漏 | 中 | 逐步补充 dark 样式，优先核心页面 |
| SSR性能影响 | 低 | 配置数据量小，可考虑缓存 |

---

## PM Handoff Complete

- PRD Version: 1.0
- Ready for TL Review: ✅
- Context Reset Recommended: Yes
