-- ========================================
-- 技术分享网站数据库初始化脚本
-- 创建时间: 2026-03-07
-- 说明: 包含示例项目、博客、分类、标签数据
-- ========================================

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- 1. 博客分类数据 (t_blog_category)
-- ========================================
INSERT INTO t_blog_category (id, name, sort_order, create_time, update_time, deleted) VALUES
(1, '后端开发', 1, NOW(), NOW(), 0),
(2, '前端开发', 2, NOW(), NOW(), 0),
(3, '人工智能', 3, NOW(), NOW(), 0),
(4, 'DevOps', 4, NOW(), NOW(), 0),
(5, '数据库', 5, NOW(), NOW(), 0),
(6, '架构设计', 6, NOW(), NOW(), 0)
ON DUPLICATE KEY UPDATE name = VALUES(name), sort_order = VALUES(sort_order), deleted = 0, update_time = NOW();

-- ========================================
-- 2. 博客标签数据 (t_blog_tag)
-- ========================================
INSERT INTO t_blog_tag (id, name, create_time, deleted) VALUES
(1, 'Java', NOW(), 0),
(2, 'Spring Boot', NOW(), 0),
(3, 'MySQL', NOW(), 0),
(4, 'Redis', NOW(), 0),
(5, 'Vue.js', NOW(), 0),
(6, 'React', NOW(), 0),
(7, 'TypeScript', NOW(), 0),
(8, 'Python', NOW(), 0),
(9, 'Docker', NOW(), 0),
(10, 'Kubernetes', NOW(), 0),
(11, '微服务', NOW(), 0),
(12, 'AI', NOW(), 0),
(13, '机器学习', NOW(), 0),
(14, '深度学习', NOW(), 0),
(15, '架构', NOW(), 0)
ON DUPLICATE KEY UPDATE name = VALUES(name), deleted = 0;

-- ========================================
-- 3. 项目数据 (t_project)
-- ========================================
INSERT INTO t_project (id, name, description, project_url, github_url, cover_image, tech_tags, sort_order, is_show, view_count, create_time, update_time, deleted) VALUES
(1,
 'AI Factory - AI应用工厂',
 '一个集成多种AI能力的应用平台，支持智能对话、内容生成、代码辅助等功能。基于Spring Boot和Vue.js构建，提供完整的AI服务解决方案。',
 'https://ai.example.com',
 'https://github.com/example/ai-factory',
 '/images/projects/ai-factory.png',
 '["Java", "Spring Boot", "Vue.js", "MySQL", "Redis"]',
 100, 1, 1256, NOW(), NOW(), 0),

(2,
 '技术分享社区',
 '面向开发者的技术分享平台，支持博客发布、项目展示、技术问答等功能。采用现代化的前后端分离架构。',
 'https://tech.example.com',
 'https://github.com/example/tech-share',
 '/images/projects/tech-share.png',
 '["Vue.js", "TypeScript", "Java", "MySQL"]',
 95, 1, 892, NOW(), NOW(), 0),

(3,
 '智能小说创作助手',
 '基于大语言模型的小说创作辅助工具，支持大纲生成、角色设定、章节续写等功能，帮助作者提升创作效率。',
 'https://novel.example.com',
 'https://github.com/example/novel-assistant',
 '/images/projects/novel-assistant.png',
 '["Python", "AI", "FastAPI", "React"]',
 90, 1, 743, NOW(), NOW(), 0),

(4,
 '微服务监控平台',
 '分布式微服务监控与管理平台，提供服务注册发现、链路追踪、性能监控、告警通知等功能。',
 'https://monitor.example.com',
 'https://github.com/example/micro-monitor',
 '/images/projects/micro-monitor.png',
 '["Java", "Spring Cloud", "Docker", "Kubernetes"]',
 85, 1, 567, NOW(), NOW(), 0),

(5,
 '低代码开发平台',
 '企业级低代码开发平台，支持可视化表单设计、流程编排、报表生成等功能，快速构建业务应用。',
 'https://lowcode.example.com',
 'https://github.com/example/lowcode-platform',
 '/images/projects/lowcode.png',
 '["Vue.js", "Java", "MySQL", "Redis"]',
 80, 1, 421, NOW(), NOW(), 0)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    project_url = VALUES(project_url),
    github_url = VALUES(github_url),
    cover_image = VALUES(cover_image),
    tech_tags = VALUES(tech_tags),
    sort_order = VALUES(sort_order),
    is_show = VALUES(is_show),
    deleted = 0,
    update_time = NOW();

-- ========================================
-- 4. 博客数据 (t_blog)
-- ========================================
INSERT INTO t_blog (id, title, summary, content, category_id, cover_image, video_url, status, publish_time, view_count, create_time, update_time, deleted) VALUES
(1,
 'Spring Boot 3.0 新特性详解',
 '本文深入介绍Spring Boot 3.0的核心新特性，包括对Java 17的最低版本要求、原生编译支持、新的可观测性API等重大更新。',
 '# Spring Boot 3.0 新特性详解\n\n## 概述\n\nSpring Boot 3.0是Spring Boot的一个重要里程碑版本，带来了许多令人兴奋的新特性。\n\n## 核心特性\n\n### 1. Java 17基线\n\nSpring Boot 3.0要求最低使用Java 17，这意味着你可以使用最新的Java特性，如记录类(record)、密封类(sealed class)、模式匹配等。\n\n### 2. 原生编译支持\n\n通过GraalVM，Spring Boot 3.0提供了原生编译支持，可以显著提升应用启动速度和降低内存占用。\n\n### 3. 新的可观测性API\n\n基于Micrometer Observation API，提供了统一的可观测性支持。\n\n## 总结\n\nSpring Boot 3.0是一个值得升级的版本，带来了现代化的开发体验。',
 1,
 '/images/blogs/spring-boot-3.png',
 NULL,
 1, NOW(), 1523, NOW(), NOW(), 0),

(2,
 'Vue 3 组合式API最佳实践',
 '探索Vue 3组合式API的设计理念和使用技巧，帮助你构建更加优雅和可维护的前端代码。',
 '# Vue 3 组合式API最佳实践\n\n## 引言\n\nVue 3的组合式API(Composition API)是Vue 3最重要的新特性之一，它提供了一种更灵活的方式来组织组件逻辑。\n\n## 为什么使用组合式API\n\n### 1. 更好的逻辑复用\n\n通过自定义组合式函数，可以轻松地在多个组件之间复用逻辑。\n\n### 2. 更好的类型推断\n\n组合式API与TypeScript配合更加完美，提供更好的类型推断。\n\n### 3. 更灵活的代码组织\n\n不再受限于选项式API的固定结构，可以按照功能组织代码。\n\n## 最佳实践\n\n### 使用setup语法糖\n\n```vue\n<script setup>\nimport { ref } from \"vue\"\nconst count = ref(0)\n</script>\n```\n\n## 总结\n\n组合式API让Vue开发更加灵活和强大。',
 2,
 '/images/blogs/vue3-composition.png',
 NULL,
 1, NOW(), 987, NOW(), NOW(), 0),

(3,
 '大语言模型应用开发指南',
 '从零开始学习如何基于大语言模型(LLM)开发智能应用，包括Prompt工程、API调用、流式输出等核心技术。',
 '# 大语言模型应用开发指南\n\n## 概述\n\n大语言模型(LLM)正在改变软件开发的方式，本文将介绍如何有效地利用LLM开发智能应用。\n\n## Prompt工程\n\n### 基本原则\n\n1. 明确任务目标\n2. 提供足够的上下文\n3. 使用示例引导\n4. 迭代优化\n\n### 高级技巧\n\n- Few-shot Learning\n- Chain-of-Thought\n- ReAct模式\n\n## API集成\n\n### 流式输出处理\n\n```python\nfor chunk in client.chat.completions.create(\n    model=\"gpt-4\",\n    messages=[{\"role\": \"user\", \"content\": \"Hello\"}],\n    stream=True\n):\n    print(chunk.choices[0].delta.content)\n```\n\n## 最佳实践\n\n1. 合理设置temperature参数\n2. 实现重试机制\n3. 做好token计数\n\n## 总结\n\n掌握LLM应用开发，开启智能应用新时代。',
 3,
 '/images/blogs/llm-development.png',
 NULL,
 1, NOW(), 2341, NOW(), NOW(), 0),

(4,
 'Docker容器化部署实战',
 '详细介绍Docker的核心概念和实战技巧，帮助你快速掌握容器化部署技术，提升开发运维效率。',
 '# Docker容器化部署实战\n\n## Docker简介\n\nDocker是一个开源的容器化平台，可以将应用程序及其依赖打包到一个可移植的容器中。\n\n## 核心概念\n\n### 镜像(Image)\n\n镜像是容器的模板，包含了运行应用所需的所有内容。\n\n### 容器(Container)\n\n容器是镜像的运行实例，是独立运行的软件单元。\n\n### Dockerfile\n\nDockerfile是构建镜像的脚本文件。\n\n```dockerfile\nFROM openjdk:17-jdk-slim\nWORKDIR /app\nCOPY target/myapp.jar app.jar\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]\n```\n\n## 实战技巧\n\n### 多阶段构建\n\n减小镜像体积的利器。\n\n### Docker Compose\n\n管理多容器应用的工具。\n\n## 总结\n\nDocker是现代软件开发不可或缺的工具。',
 4,
 '/images/blogs/docker-deploy.png',
 NULL,
 1, NOW(), 756, NOW(), NOW(), 0),

(5,
 'MySQL性能优化深度解析',
 '从索引设计、查询优化、参数调优等多个维度，深入解析MySQL性能优化的方法和技巧。',
 '# MySQL性能优化深度解析\n\n## 为什么需要优化\n\n随着数据量增长，数据库性能往往成为系统瓶颈。\n\n## 索引优化\n\n### 索引设计原则\n\n1. 选择合适的索引类型\n2. 遵循最左前缀原则\n3. 避免过度索引\n\n### 常见问题\n\n- 索引失效场景\n- 联合索引优化\n\n## 查询优化\n\n### EXPLAIN分析\n\n使用EXPLAIN分析查询执行计划。\n\n### 优化技巧\n\n1. 避免SELECT *\n2. 合理使用JOIN\n3. 分页优化\n\n## 参数调优\n\n### InnoDB缓冲池\n\n```sql\nSET GLOBAL innodb_buffer_pool_size = 4294967296;\n```\n\n## 总结\n\n性能优化是一个持续的过程，需要不断监控和调整。',
 5,
 '/images/blogs/mysql-optimization.png',
 NULL,
 1, NOW(), 1124, NOW(), NOW(), 0)
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    summary = VALUES(summary),
    content = VALUES(content),
    category_id = VALUES(category_id),
    cover_image = VALUES(cover_image),
    status = VALUES(status),
    deleted = 0,
    update_time = NOW();

-- ========================================
-- 5. 博客标签关联数据 (t_blog_tag_relation)
-- ========================================
INSERT INTO t_blog_tag_relation (id, blog_id, tag_id, create_time) VALUES
-- 博客1: Spring Boot 3.0 新特性详解
(1, 1, 1, NOW()),   -- Java
(2, 1, 2, NOW()),   -- Spring Boot
(3, 1, 3, NOW()),   -- MySQL

-- 博客2: Vue 3 组合式API最佳实践
(4, 2, 5, NOW()),   -- Vue.js
(5, 2, 7, NOW()),   -- TypeScript

-- 博客3: 大语言模型应用开发指南
(6, 3, 8, NOW()),   -- Python
(7, 3, 12, NOW()),  -- AI
(8, 3, 13, NOW()),  -- 机器学习
(9, 3, 14, NOW()),  -- 深度学习

-- 博客4: Docker容器化部署实战
(10, 4, 9, NOW()),  -- Docker
(11, 4, 10, NOW()), -- Kubernetes

-- 博客5: MySQL性能优化深度解析
(12, 5, 3, NOW()),  -- MySQL
(13, 5, 15, NOW())  -- 架构
ON DUPLICATE KEY UPDATE blog_id = VALUES(blog_id), tag_id = VALUES(tag_id);

-- ========================================
-- 6. 示例反馈数据 (t_feedback)
-- ========================================
INSERT INTO t_feedback (id, name, email, qq, wechat, content, is_read, create_time, deleted) VALUES
(1,
 '张三',
 'zhangsan@example.com',
 '123456789',
 'zhangsan_wx',
 '网站设计很棒，希望能增加更多技术文章！',
 1, NOW(), 0),

(2,
 '李四',
 'lisi@example.com',
 '987654321',
 NULL,
 '建议增加一个搜索功能，方便查找历史文章。',
 0, NOW(), 0)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    email = VALUES(email),
    content = VALUES(content),
    deleted = 0;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- 初始化完成
-- ========================================
