-- ============================================
-- 系统配置增强 - 初始化配置项
-- 功能：Logo配置、打赏功能开关、导航菜单开关
-- 创建时间：2025-03-09
-- ============================================

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- 1. 创建系统配置表（如果不存在）
-- ========================================
CREATE TABLE IF NOT EXISTS t_system_config (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '配置ID',
    config_key VARCHAR(100) NOT NULL COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_name VARCHAR(100) COMMENT '配置名称',
    description VARCHAR(255) COMMENT '配置描述',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- ========================================
-- 2. 插入系统配置项
-- 使用 ON DUPLICATE KEY UPDATE 避免重复插入
-- ========================================
INSERT INTO t_system_config (config_key, config_value, config_name, description, create_time, update_time)
VALUES
-- Logo配置
('LOGO_TYPE', 'text', 'Logo类型', 'Logo显示类型：text-文字Logo，image-图片Logo', NOW(), NOW()),
('LOGO_IMAGE_URL', '', 'Logo图片地址', '当Logo类型为image时使用的图片URL', NOW(), NOW()),

-- 打赏功能配置
('DONATION_ENABLED', 'true', '打赏功能开关', '是否启用打赏功能', NOW(), NOW()),

-- 导航菜单配置
('NAV_HOME_ENABLED', 'true', '首页导航开关', '是否显示首页导航', NOW(), NOW()),
('NAV_PROJECTS_ENABLED', 'true', '项目导航开关', '是否显示项目导航', NOW(), NOW()),
('NAV_BLOGS_ENABLED', 'true', '博客导航开关', '是否显示博客导航', NOW(), NOW()),
('NAV_FEEDBACK_ENABLED', 'true', '反馈导航开关', '是否显示反馈导航', NOW(), NOW()),
('NAV_DONATION_ENABLED', 'true', '打赏导航开关', '是否显示打赏导航', NOW(), NOW())

ON DUPLICATE KEY UPDATE
    config_value = VALUES(config_value),
    config_name = VALUES(config_name),
    description = VALUES(description),
    update_time = NOW();

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- 验证插入结果（取消注释以执行验证）
-- ========================================
-- SELECT * FROM t_system_config WHERE config_key IN (
--     'LOGO_TYPE', 'LOGO_IMAGE_URL', 'DONATION_ENABLED',
--     'NAV_HOME_ENABLED', 'NAV_PROJECTS_ENABLED', 'NAV_BLOGS_ENABLED',
--     'NAV_FEEDBACK_ENABLED', 'NAV_DONATION_ENABLED'
-- );
