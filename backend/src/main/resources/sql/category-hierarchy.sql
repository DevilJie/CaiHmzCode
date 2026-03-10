-- =====================================================
-- 博客分类多级分类支持迁移脚本
-- 创建时间: 2026-03-09
-- 说明: 添加parent_id和level字段支持分类层级结构
-- =====================================================

-- 添加多级分类支持字段
ALTER TABLE t_blog_category
ADD COLUMN parent_id BIGINT NULL COMMENT '父分类ID' AFTER name,
ADD COLUMN level INT DEFAULT 0 COMMENT '层级深度' AFTER parent_id;

-- 更新现有数据，确保顶级分类的parent_id为NULL，level为0
UPDATE t_blog_category SET parent_id = NULL, level = 0 WHERE parent_id IS NULL;

-- 添加索引，优化按父分类查询的性能
CREATE INDEX idx_parent_id ON t_blog_category(parent_id);

-- 添加外键约束（可选，根据实际需求启用）
-- ALTER TABLE t_blog_category
-- ADD CONSTRAINT fk_parent_category
-- FOREIGN KEY (parent_id) REFERENCES t_blog_category(id)
-- ON DELETE SET NULL;
