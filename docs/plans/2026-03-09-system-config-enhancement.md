# 系统配置增强与用户体验优化 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现系统配置在用户端实时生效，支持Logo/导航配置，多级分类，以及主题切换功能。

**Architecture:** 后端通过SystemConfigService管理配置，前端通过SSR获取配置并动态渲染。多级分类使用parent_id实现树形结构。主题切换使用next-themes库。

**Tech Stack:** Spring Boot 3.2.5, Next.js 14, Tailwind CSS 3.4, next-themes, MySQL

---

## Phase 0: 后端配置扩展（P0）

### Task 1: 扩展SiteInfoResponse DTO

**Files:**
- Modify: `backend/src/main/java/com/aifactory/techshare/dto/SiteInfoResponse.java`

**Step 1: 添加新字段到SiteInfoResponse**

```java
package com.aifactory.techshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 网站信息响应DTO（用户端）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteInfoResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 网站名称
     */
    private String siteName;

    /**
     * ICP备案号
     */
    private String icpNumber;

    /**
     * 页脚文字
     */
    private String footerText;

    /**
     * Logo类型：text 或 image
     */
    private String logoType;

    /**
     * Logo图片地址
     */
    private String logoImageUrl;

    /**
     * 打赏功能是否启用
     */
    private Boolean donationEnabled;

    /**
     * 导航配置
     */
    private NavConfig navConfig;

    /**
     * 导航配置内部类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NavConfig implements Serializable {
        private static final long serialVersionUID = 1L;
        private Boolean home;
        private Boolean projects;
        private Boolean blogs;
        private Boolean feedback;
        private Boolean donation;
    }
}
```

**Step 2: 验证编译**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

**Step 3: Commit**

```bash
git add backend/src/main/java/com/aifactory/techshare/dto/SiteInfoResponse.java
git commit -m "feat: 扩展SiteInfoResponse支持Logo和导航配置"
```

---

### Task 2: 扩展SystemConfigService

**Files:**
- Modify: `backend/src/main/java/com/aifactory/techshare/service/SystemConfigService.java`

**Step 1: 添加新的配置键常量**

在SystemConfigService.java中添加：

```java
// 在现有常量后添加
private static final String KEY_LOGO_TYPE = "LOGO_TYPE";
private static final String KEY_LOGO_IMAGE_URL = "LOGO_IMAGE_URL";
private static final String KEY_DONATION_ENABLED = "DONATION_ENABLED";
private static final String KEY_NAV_HOME_ENABLED = "NAV_HOME_ENABLED";
private static final String KEY_NAV_PROJECTS_ENABLED = "NAV_PROJECTS_ENABLED";
private static final String KEY_NAV_BLOGS_ENABLED = "NAV_BLOGS_ENABLED";
private static final String KEY_NAV_FEEDBACK_ENABLED = "NAV_FEEDBACK_ENABLED";
private static final String KEY_NAV_DONATION_ENABLED = "NAV_DONATION_ENABLED";
```

**Step 2: 修改getSiteInfo方法**

```java
/**
 * 获取网站信息（用户端）
 */
public SiteInfoResponse getSiteInfo() {
    return SiteInfoResponse.builder()
            .siteName(getConfigValue(KEY_SITE_NAME))
            .icpNumber(getConfigValue(KEY_ICP_NUMBER))
            .footerText(getConfigValue(KEY_FOOTER_TEXT))
            .logoType(getConfigValue(KEY_LOGO_TYPE, "text"))
            .logoImageUrl(getConfigValue(KEY_LOGO_IMAGE_URL))
            .donationEnabled(getBooleanConfigValue(KEY_DONATION_ENABLED, true))
            .navConfig(SiteInfoResponse.NavConfig.builder()
                    .home(getBooleanConfigValue(KEY_NAV_HOME_ENABLED, true))
                    .projects(getBooleanConfigValue(KEY_NAV_PROJECTS_ENABLED, true))
                    .blogs(getBooleanConfigValue(KEY_NAV_BLOGS_ENABLED, true))
                    .feedback(getBooleanConfigValue(KEY_NAV_FEEDBACK_ENABLED, true))
                    .donation(getBooleanConfigValue(KEY_NAV_DONATION_ENABLED, true))
                    .build())
            .build();
}

/**
 * 获取单个配置值，支持默认值
 */
private String getConfigValue(String key, String defaultValue) {
    String value = getConfigValue(key);
    return (value == null || value.isBlank()) ? defaultValue : value;
}

/**
 * 获取布尔类型配置值
 */
private Boolean getBooleanConfigValue(String key, Boolean defaultValue) {
    String value = getConfigValue(key);
    if (value == null || value.isBlank()) {
        return defaultValue;
    }
    return "true".equalsIgnoreCase(value);
}
```

**Step 3: 验证编译**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

**Step 4: Commit**

```bash
git add backend/src/main/java/com/aifactory/techshare/service/SystemConfigService.java
git commit -m "feat: SystemConfigService支持Logo和导航配置"
```

---

### Task 3: 扩展SystemConfigRequest DTO

**Files:**
- Modify: `backend/src/main/java/com/aifactory/techshare/dto/SystemConfigRequest.java`

**Step 1: 添加新字段**

```java
package com.aifactory.techshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 系统配置更新请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private String siteName;
    private String icpNumber;
    private String footerText;
    private String githubToken;

    // 新增字段
    private String logoType;
    private String logoImageUrl;
    private Boolean donationEnabled;
    private Boolean navHomeEnabled;
    private Boolean navProjectsEnabled;
    private Boolean navBlogsEnabled;
    private Boolean navFeedbackEnabled;
    private Boolean navDonationEnabled;
}
```

**Step 2: 更新updateSystemConfigs方法**

在SystemConfigService.java中更新：

```java
@Transactional(rollbackFor = Exception.class)
public SystemConfigResponse updateSystemConfigs(SystemConfigRequest request) {
    // 更新现有配置
    updateConfigValue(KEY_SITE_NAME, request.getSiteName());
    updateConfigValue(KEY_ICP_NUMBER, request.getIcpNumber());
    updateConfigValue(KEY_FOOTER_TEXT, request.getFooterText());
    updateConfigValue(KEY_GITHUB_TOKEN, request.getGithubToken());

    // 更新新增配置
    updateConfigValue(KEY_LOGO_TYPE, request.getLogoType());
    updateConfigValue(KEY_LOGO_IMAGE_URL, request.getLogoImageUrl());
    updateBooleanConfigValue(KEY_DONATION_ENABLED, request.getDonationEnabled());
    updateBooleanConfigValue(KEY_NAV_HOME_ENABLED, request.getNavHomeEnabled());
    updateBooleanConfigValue(KEY_NAV_PROJECTS_ENABLED, request.getNavProjectsEnabled());
    updateBooleanConfigValue(KEY_NAV_BLOGS_ENABLED, request.getNavBlogsEnabled());
    updateBooleanConfigValue(KEY_NAV_FEEDBACK_ENABLED, request.getNavFeedbackEnabled());
    updateBooleanConfigValue(KEY_NAV_DONATION_ENABLED, request.getNavDonationEnabled());

    log.info("系统配置更新成功");

    return getSystemConfigs();
}

/**
 * 更新布尔类型配置值
 */
private void updateBooleanConfigValue(String key, Boolean value) {
    updateConfigValue(key, value != null ? value.toString() : "true");
}
```

**Step 3: 验证编译**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

**Step 4: Commit**

```bash
git add backend/src/main/java/com/aifactory/techshare/dto/SystemConfigRequest.java backend/src/main/java/com/aifactory/techshare/service/SystemConfigService.java
git commit -m "feat: 系统配置支持Logo和导航配置更新"
```

---

### Task 4: 初始化数据库配置项

**Files:**
- Create: `backend/src/main/resources/db/migration/V1.0.1__add_system_config.sql`

**Step 1: 创建迁移脚本**

```sql
-- 添加新的系统配置项
INSERT INTO t_system_config (config_key, config_value, config_name, description, create_time, update_time)
VALUES
('LOGO_TYPE', 'text', 'Logo类型', 'Logo显示类型：text-文字Logo，image-图片Logo', NOW(), NOW()),
('LOGO_IMAGE_URL', '', 'Logo图片地址', '当Logo类型为image时使用的图片URL', NOW(), NOW()),
('DONATION_ENABLED', 'true', '打赏功能开关', '是否启用打赏功能', NOW(), NOW()),
('NAV_HOME_ENABLED', 'true', '首页导航开关', '是否显示首页导航', NOW(), NOW()),
('NAV_PROJECTS_ENABLED', 'true', '项目导航开关', '是否显示项目导航', NOW(), NOW()),
('NAV_BLOGS_ENABLED', 'true', '博客导航开关', '是否显示博客导航', NOW(), NOW()),
('NAV_FEEDBACK_ENABLED', 'true', '反馈导航开关', '是否显示反馈导航', NOW(), NOW()),
('NAV_DONATION_ENABLED', 'true', '打赏导航开关', '是否显示打赏导航', NOW(), NOW())
ON DUPLICATE KEY UPDATE update_time = NOW();
```

**Step 2: 手动执行SQL（或通过MySQL MCP执行）**

**Step 3: Commit**

```bash
git add backend/src/main/resources/db/migration/V1.0.1__add_system_config.sql
git commit -m "feat: 添加系统配置初始化SQL"
```

---

## Phase 1: 前端配置服务与类型定义（P0）

### Task 5: 更新前端类型定义

**Files:**
- Modify: `frontend/src/types/index.ts`

**Step 1: 更新SiteInfo接口**

```typescript
// ==================== 系统配置相关 ====================

/**
 * 导航配置
 */
export interface NavConfig {
  home: boolean;
  projects: boolean;
  blogs: boolean;
  feedback: boolean;
  donation: boolean;
}

/**
 * 网站信息
 */
export interface SiteInfo {
  siteName: string;
  icpNumber: string;
  footerText: string;
  logoType: 'text' | 'image';
  logoImageUrl: string;
  donationEnabled: boolean;
  navConfig: NavConfig;
}

/**
 * 系统配置更新请求
 */
export interface SystemConfigRequest {
  siteName: string;
  icpNumber?: string;
  footerText?: string;
  githubToken?: string;
  // 新增字段
  logoType?: 'text' | 'image';
  logoImageUrl?: string;
  donationEnabled?: boolean;
  navHomeEnabled?: boolean;
  navProjectsEnabled?: boolean;
  navBlogsEnabled?: boolean;
  navFeedbackEnabled?: boolean;
  navDonationEnabled?: boolean;
}
```

**Step 2: Commit**

```bash
git add frontend/src/types/index.ts
git commit -m "feat: 更新前端类型定义支持Logo和导航配置"
```

---

### Task 6: 创建用户端系统配置服务

**Files:**
- Create: `frontend/src/services/system.ts`

**Step 1: 创建服务文件**

```typescript
import apiClient from '@/lib/axios';
import { ApiResponse, SiteInfo } from '@/types';

/**
 * 系统配置服务（用户端）
 */
export const systemService = {
  /**
   * 获取网站信息
   */
  async getSiteInfo(): Promise<SiteInfo> {
    const response = (await apiClient.get('/system/info')) as ApiResponse<SiteInfo>;

    if (response.code === 200 && response.data) {
      return response.data;
    }

    // 返回默认配置
    return {
      siteName: '技术分享站',
      icpNumber: '',
      footerText: '',
      logoType: 'text',
      logoImageUrl: '',
      donationEnabled: true,
      navConfig: {
        home: true,
        projects: true,
        blogs: true,
        feedback: true,
        donation: true,
      },
    };
  },
};

export default systemService;
```

**Step 2: Commit**

```bash
git add frontend/src/services/system.ts
git commit -m "feat: 创建用户端系统配置服务"
```

---

### Task 7: 重构Navbar组件

**Files:**
- Modify: `frontend/src/components/layout/Navbar.tsx`

**Step 1: 重构Navbar为配置驱动**

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';
import { SiteInfo } from '@/types';
import { systemService } from '@/services/system';

/**
 * Navbar导航栏组件
 *
 * 功能:
 * - 固定顶部导航栏
 * - Logo + 网站名称（支持图片/文字两种模式）
 * - 导航链接（配置驱动）
 * - 响应式设计（移动端汉堡菜单）
 */
export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);

  useEffect(() => {
    systemService.getSiteInfo().then(setSiteInfo);
  }, []);

  // 基于配置生成导航链接
  const navLinks = siteInfo?.navConfig
    ? [
        { href: '/', label: '首页', enabled: siteInfo.navConfig.home },
        { href: '/projects', label: '项目', enabled: siteInfo.navConfig.projects },
        { href: '/blogs', label: '博客', enabled: siteInfo.navConfig.blogs },
        { href: '/feedback', label: '反馈', enabled: siteInfo.navConfig.feedback },
        { href: '/donation', label: '打赏', enabled: siteInfo.navConfig.donation && siteInfo.donationEnabled },
      ].filter(link => link.enabled)
    : [];

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // 渲染Logo
  const renderLogo = () => {
    if (!siteInfo) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg animate-pulse" />
          <span className="text-xl font-bold text-secondary-400">加载中...</span>
        </div>
      );
    }

    if (siteInfo.logoType === 'image' && siteInfo.logoImageUrl) {
      return (
        <div className="flex items-center space-x-2">
          <Image
            src={siteInfo.logoImageUrl}
            alt={siteInfo.siteName}
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            {siteInfo.siteName}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 group">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-white font-bold text-sm">
            {siteInfo.siteName?.charAt(0) || 'T'}
          </span>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          {siteInfo.siteName}
        </span>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav data-testid="main-nav" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
            {renderLogo()}
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActiveLink(link.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-secondary-600 hover:text-primary-600 transition-colors md:hidden"
            aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* 移动端菜单 */}
        <div
          className={clsx(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col space-y-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={clsx(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  isActiveLink(link.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
```

**Step 2: 验证前端编译**

Run: `cd frontend && npm run build`
Expected: Build success

**Step 3: Commit**

```bash
git add frontend/src/components/layout/Navbar.tsx
git commit -m "feat: 重构Navbar为配置驱动，移除管理后台入口"
```

---

### Task 8: 更新管理端设置页面

**Files:**
- Modify: `frontend/src/app/admin/settings/page.tsx`

**Step 1: 添加Logo和导航配置UI**

在现有的settings页面中添加新的配置区域。由于文件较大，这里只展示新增的关键部分：

```typescript
// 在formData state中添加新字段
const [formData, setFormData] = useState<SystemConfigRequest>({
  siteName: '',
  icpNumber: '',
  footerText: '',
  githubToken: '',
  // 新增
  logoType: 'text',
  logoImageUrl: '',
  donationEnabled: true,
  navHomeEnabled: true,
  navProjectsEnabled: true,
  navBlogsEnabled: true,
  navFeedbackEnabled: true,
  navDonationEnabled: true,
});

// 在loadConfig中添加
setFormData({
  ...existing fields...
  logoType: data.logoType || 'text',
  logoImageUrl: data.logoImageUrl || '',
  donationEnabled: data.donationEnabled ?? true,
  navHomeEnabled: data.navHomeEnabled ?? true,
  navProjectsEnabled: data.navProjectsEnabled ?? true,
  navBlogsEnabled: data.navBlogsEnabled ?? true,
  navFeedbackEnabled: data.navFeedbackEnabled ?? true,
  navDonationEnabled: data.navDonationEnabled ?? true,
});

// 在JSX中添加Logo配置区域
{/* Logo配置 */}
<div className="rounded-lg bg-white p-6 shadow-card">
  <h2 className="mb-4 text-lg font-semibold text-secondary-800">Logo配置</h2>
  <div className="space-y-4">
    <div>
      <label className="mb-1 block text-sm font-medium text-secondary-700">Logo类型</label>
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="logoType"
            value="text"
            checked={formData.logoType === 'text'}
            onChange={(e) => setFormData({ ...formData, logoType: 'text' as const })}
            className="mr-2"
          />
          文字Logo
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="logoType"
            value="image"
            checked={formData.logoType === 'image'}
            onChange={(e) => setFormData({ ...formData, logoType: 'image' as const })}
            className="mr-2"
          />
          图片Logo
        </label>
      </div>
    </div>
    {formData.logoType === 'image' && (
      <div>
        <label className="mb-1 block text-sm font-medium text-secondary-700">Logo图片</label>
        <input
          type="text"
          value={formData.logoImageUrl}
          onChange={(e) => setFormData({ ...formData, logoImageUrl: e.target.value })}
          className="w-full rounded-lg border border-secondary-300 px-4 py-2"
          placeholder="输入Logo图片URL"
        />
      </div>
    )}
  </div>
</div>

{/* 导航配置 */}
<div className="rounded-lg bg-white p-6 shadow-card">
  <h2 className="mb-4 text-lg font-semibold text-secondary-800">导航配置</h2>
  <div className="space-y-3">
    {[
      { key: 'navHomeEnabled', label: '首页导航' },
      { key: 'navProjectsEnabled', label: '项目导航' },
      { key: 'navBlogsEnabled', label: '博客导航' },
      { key: 'navFeedbackEnabled', label: '反馈导航' },
      { key: 'navDonationEnabled', label: '打赏导航' },
    ].map((item) => (
      <label key={item.key} className="flex items-center justify-between">
        <span className="text-sm text-secondary-700">{item.label}</span>
        <input
          type="checkbox"
          checked={formData[item.key as keyof SystemConfigRequest] as boolean}
          onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
          className="h-4 w-4 rounded border-secondary-300 text-primary-600"
        />
      </label>
    ))}
  </div>
</div>

{/* 打赏功能开关 */}
<div className="rounded-lg bg-white p-6 shadow-card">
  <h2 className="mb-4 text-lg font-semibold text-secondary-800">功能开关</h2>
  <label className="flex items-center justify-between">
    <span className="text-sm text-secondary-700">打赏功能</span>
    <input
      type="checkbox"
      checked={formData.donationEnabled}
      onChange={(e) => setFormData({ ...formData, donationEnabled: e.target.checked })}
      className="h-4 w-4 rounded border-secondary-300 text-primary-600"
    />
  </label>
</div>
```

**Step 2: Commit**

```bash
git add frontend/src/app/admin/settings/page.tsx
git commit -m "feat: 管理端设置页面添加Logo和导航配置"
```

---

## Phase 2: 多级分类（P1）

### Task 9: 扩展BlogCategory实体

**Files:**
- Modify: `backend/src/main/java/com/aifactory/techshare/entity/BlogCategory.java`

**Step 1: 添加parent_id和level字段**

```java
package com.aifactory.techshare.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 博客分类实体类
 */
@Data
@TableName("t_blog_category")
public class BlogCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 分类名称
     */
    private String name;

    /**
     * 父分类ID，顶级为NULL
     */
    private Long parentId;

    /**
     * 层级深度，顶级为0
     */
    private Integer level;

    /**
     * 排序顺序
     */
    private Integer sortOrder;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
```

**Step 2: 数据库迁移脚本**

Create: `backend/src/main/resources/db/migration/V1.0.2__add_category_hierarchy.sql`

```sql
-- 添加多级分类支持
ALTER TABLE t_blog_category
ADD COLUMN parent_id BIGINT NULL COMMENT '父分类ID' AFTER name,
ADD COLUMN level INT DEFAULT 0 COMMENT '层级深度' AFTER parent_id;

-- 更新现有数据
UPDATE t_blog_category SET parent_id = NULL, level = 0 WHERE parent_id IS NULL;

-- 添加索引
CREATE INDEX idx_parent_id ON t_blog_category(parent_id);
```

**Step 3: Commit**

```bash
git add backend/src/main/java/com/aifactory/techshare/entity/BlogCategory.java backend/src/main/resources/db/migration/V1.0.2__add_category_hierarchy.sql
git commit -m "feat: BlogCategory支持多级分类"
```

---

### Task 10: 创建分类树DTO

**Files:**
- Create: `backend/src/main/java/com/aifactory/techshare/dto/CategoryTreeResponse.java`

**Step 1: 创建DTO**

```java
package com.aifactory.techshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 分类树响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryTreeResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private Long parentId;
    private Integer level;
    private Integer sortOrder;
    private List<CategoryTreeResponse> children;
    private Boolean isLeaf;
}
```

**Step 2: Commit**

```bash
git add backend/src/main/java/com/aifactory/techshare/dto/CategoryTreeResponse.java
git commit -m "feat: 创建分类树响应DTO"
```

---

### Task 11: 扩展BlogCategoryService

**Files:**
- Modify: `backend/src/main/java/com/aifactory/techshare/service/BlogCategoryService.java`

**Step 1: 添加分类树相关方法**

```java
/**
 * 获取分类树
 */
public List<CategoryTreeResponse> getCategoryTree() {
    List<BlogCategory> allCategories = blogCategoryMapper.selectList(
        new LambdaQueryWrapper<BlogCategory>()
            .orderByAsc(BlogCategory::getLevel)
            .orderByAsc(BlogCategory::getSortOrder)
    );
    return buildTree(allCategories, null);
}

/**
 * 获取所有末级分类（用于文章关联）
 */
public List<BlogCategory> getLeafCategories() {
    List<BlogCategory> allCategories = blogCategoryMapper.selectList(null);
    Set<Long> parentIds = allCategories.stream()
        .map(BlogCategory::getParentId)
        .filter(Objects::nonNull)
        .collect(Collectors.toSet());

    return allCategories.stream()
        .filter(c -> !parentIds.contains(c.getId()))
        .collect(Collectors.toList());
}

/**
 * 递归构建分类树
 */
private List<CategoryTreeResponse> buildTree(List<BlogCategory> allCategories, Long parentId) {
    return allCategories.stream()
        .filter(c -> Objects.equals(c.getParentId(), parentId))
        .map(c -> {
            List<CategoryTreeResponse> children = buildTree(allCategories, c.getId());
            return CategoryTreeResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .parentId(c.getParentId())
                .level(c.getLevel())
                .sortOrder(c.getSortOrder())
                .children(children.isEmpty() ? null : children)
                .isLeaf(children.isEmpty())
                .build();
        })
        .collect(Collectors.toList());
}

/**
 * 创建分类
 */
public BlogCategory createCategory(String name, Long parentId) {
    int level = 0;
    if (parentId != null) {
        BlogCategory parent = blogCategoryMapper.selectById(parentId);
        if (parent == null) {
            throw new BusinessException("父分类不存在");
        }
        level = parent.getLevel() + 1;
    }

    BlogCategory category = new BlogCategory();
    category.setName(name);
    category.setParentId(parentId);
    category.setLevel(level);
    category.setSortOrder(0);
    blogCategoryMapper.insert(category);
    return category;
}

/**
 * 删除分类（检查是否有子分类或关联文章）
 */
public void deleteCategory(Long id) {
    // 检查是否有子分类
    Long childCount = blogCategoryMapper.selectCount(
        new LambdaQueryWrapper<BlogCategory>()
            .eq(BlogCategory::getParentId, id)
    );
    if (childCount > 0) {
        throw new BusinessException("该分类下存在子分类，无法删除");
    }

    // 检查是否有关联文章
    // TODO: 添加文章关联检查

    blogCategoryMapper.deleteById(id);
}
```

**Step 2: Commit**

```bash
git add backend/src/main/java/com/aifactory/techshare/service/BlogCategoryService.java
git commit -m "feat: BlogCategoryService支持分类树操作"
```

---

### Task 12: 添加分类树API接口

**Files:**
- Modify: `backend/src/main/java/com/aifactory/techshare/controller/BlogCategoryController.java`

**Step 1: 添加分类树接口**

```java
@GetMapping("/tree")
@Operation(summary = "获取分类树", description = "获取完整的分类树结构")
public Result<List<CategoryTreeResponse>> getCategoryTree() {
    List<CategoryTreeResponse> tree = blogCategoryService.getCategoryTree();
    return Result.success(tree);
}

@GetMapping("/leaves")
@Operation(summary = "获取末级分类", description = "获取所有末级分类（用于文章关联）")
public Result<List<BlogCategory>> getLeafCategories() {
    List<BlogCategory> leaves = blogCategoryService.getLeafCategories();
    return Result.success(leaves);
}
```

**Step 2: Commit**

```bash
git add backend/src/main/java/com/aifactory/techshare/controller/BlogCategoryController.java
git commit -m "feat: 添加分类树API接口"
```

---

## Phase 3: 主题切换（P2）

### Task 13: 安装next-themes依赖

**Step 1: 安装依赖**

Run: `cd frontend && npm install next-themes`

**Step 2: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "feat: 安装next-themes依赖"
```

---

### Task 14: 配置Tailwind暗色模式

**Files:**
- Modify: `frontend/tailwind.config.js`

**Step 1: 启用darkMode**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',  // 添加这行
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ... rest of config
```

**Step 2: 添加暗色主题颜色**

在theme.extend.colors中添加dark主题色：

```javascript
// 在secondary后添加
dark: {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
},
```

**Step 3: Commit**

```bash
git add frontend/tailwind.config.js
git commit -m "feat: 配置Tailwind暗色模式"
```

---

### Task 15: 创建ThemeProvider

**Files:**
- Create: `frontend/src/providers/ThemeProvider.tsx`

**Step 1: 创建ThemeProvider**

```typescript
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Step 2: Commit**

```bash
git add frontend/src/providers/ThemeProvider.tsx
git commit -m "feat: 创建ThemeProvider"
```

---

### Task 16: 创建主题切换组件

**Files:**
- Create: `frontend/src/components/layout/ThemeToggle.tsx`

**Step 1: 创建组件**

```typescript
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-secondary-100">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 dark:bg-dark-700 dark:hover:bg-dark-600 transition-colors"
      aria-label={theme === 'dark' ? '切换到日间模式' : '切换到夜间模式'}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/layout/ThemeToggle.tsx
git commit -m "feat: 创建主题切换组件"
```

---

### Task 17: 更新用户端布局添加ThemeProvider

**Files:**
- Modify: `frontend/src/app/(user)/layout.tsx`

**Step 1: 添加ThemeProvider**

```typescript
import UserLayout from '@/components/layout/UserLayout';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function UserRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserLayout>{children}</UserLayout>
    </ThemeProvider>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/app/(user)/layout.tsx
git commit -m "feat: 用户端布局添加ThemeProvider"
```

---

### Task 18: 在Navbar添加主题切换按钮

**Files:**
- Modify: `frontend/src/components/layout/Navbar.tsx`

**Step 1: 导入并添加ThemeToggle**

在桌面端导航区域添加：

```typescript
import ThemeToggle from './ThemeToggle';

// 在桌面端导航链接后添加
{/* 主题切换 */}
<ThemeToggle />
```

**Step 2: Commit**

```bash
git add frontend/src/components/layout/Navbar.tsx
git commit -m "feat: Navbar添加主题切换按钮"
```

---

## Phase 4: 博客列表布局切换（P2）

### Task 19: 创建布局切换组件

**Files:**
- Create: `frontend/src/components/blog/LayoutToggle.tsx`

**Step 1: 创建组件**

```typescript
'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

export type LayoutMode = 'grid' | 'list';

interface LayoutToggleProps {
  value: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export default function LayoutToggle({ value, onChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary-100 dark:bg-dark-700 rounded-lg p-1">
      <button
        onClick={() => onChange('grid')}
        className={clsx(
          'p-2 rounded-md transition-colors',
          value === 'grid'
            ? 'bg-white dark:bg-dark-600 shadow-sm'
            : 'hover:bg-white/50 dark:hover:bg-dark-600/50'
        )}
        aria-label="卡片视图"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => onChange('list')}
        className={clsx(
          'p-2 rounded-md transition-colors',
          value === 'list'
            ? 'bg-white dark:bg-dark-600 shadow-sm'
            : 'hover:bg-white/50 dark:hover:bg-dark-600/50'
        )}
        aria-label="列表视图"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/blog/LayoutToggle.tsx
git commit -m "feat: 创建布局切换组件"
```

---

### Task 20: 更新博客页面支持布局切换

**Files:**
- Modify: `frontend/src/app/(user)/blogs/page.tsx`

**Step 1: 添加布局状态和本地存储**

```typescript
import { useState, useEffect } from 'react';
import LayoutToggle, { LayoutMode } from '@/components/blog/LayoutToggle';

// 在组件内添加
const [layout, setLayout] = useState<LayoutMode>('grid');

useEffect(() => {
  const savedLayout = localStorage.getItem('blog_layout') as LayoutMode;
  if (savedLayout) setLayout(savedLayout);
}, []);

const handleLayoutChange = (mode: LayoutMode) => {
  setLayout(mode);
  localStorage.setItem('blog_layout', mode);
};

// 在筛选区域添加布局切换
<LayoutToggle value={layout} onChange={handleLayoutChange} />

// 根据layout渲染不同布局
```

**Step 2: Commit**

```bash
git add frontend/src/app/(user)/blogs/page.tsx
git commit -m "feat: 博客页面支持布局切换"
```

---

## Phase 5: 博客标签位置调整（P2）

### Task 21: 调整博客页面标签位置

**Files:**
- Modify: `frontend/src/app/(user)/blogs/page.tsx`

**Step 1: 将标签筛选移到分类筛选下方**

调整页面布局，使标签筛选在分类下方显示。

**Step 2: Commit**

```bash
git add frontend/src/app/(user)/blogs/page.tsx
git commit -m "feat: 调整博客页面标签位置"
```

---

## 最终验收

### 验收检查清单

**P0 验收：**
- [ ] 用户端能正确显示管理端配置的网站名称
- [ ] 用户端导航栏不再显示"管理后台"入口
- [ ] 配置变更后，刷新页面即可生效

**P1 验收：**
- [ ] 管理端可切换Logo类型（文字/图片）
- [ ] 图片Logo能正确上传和显示
- [ ] 各导航项可通过管理端控制显示/隐藏
- [ ] 打赏功能关闭后，用户端不显示打赏导航
- [ ] 分类支持无限层级
- [ ] 文章只能关联末级分类

**P2 验收：**
- [ ] 主题切换功能正常，刷新页面保持用户选择
- [ ] 博客列表布局切换功能正常
- [ ] 标签筛选区域位置正确

---

## 任务总览

| Phase | Task | 描述 | 优先级 |
|-------|------|------|--------|
| 0 | 1 | 扩展SiteInfoResponse DTO | P0 |
| 0 | 2 | 扩展SystemConfigService | P0 |
| 0 | 3 | 扩展SystemConfigRequest DTO | P0 |
| 0 | 4 | 初始化数据库配置项 | P0 |
| 1 | 5 | 更新前端类型定义 | P0 |
| 1 | 6 | 创建用户端系统配置服务 | P0 |
| 1 | 7 | 重构Navbar组件 | P0 |
| 1 | 8 | 更新管理端设置页面 | P1 |
| 2 | 9 | 扩展BlogCategory实体 | P1 |
| 2 | 10 | 创建分类树DTO | P1 |
| 2 | 11 | 扩展BlogCategoryService | P1 |
| 2 | 12 | 添加分类树API接口 | P1 |
| 3 | 13 | 安装next-themes依赖 | P2 |
| 3 | 14 | 配置Tailwind暗色模式 | P2 |
| 3 | 15 | 创建ThemeProvider | P2 |
| 3 | 16 | 创建主题切换组件 | P2 |
| 3 | 17 | 更新用户端布局 | P2 |
| 3 | 18 | 在Navbar添加主题切换 | P2 |
| 4 | 19 | 创建布局切换组件 | P2 |
| 4 | 20 | 更新博客页面布局切换 | P2 |
| 5 | 21 | 调整标签位置 | P2 |
