'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useToast } from '@/contexts/ToastContext';
import MarkdownEditor from './MarkdownEditor';
import {
  adminBlogService,
  adminCategoryService,
  adminTagService,
  BlogRequest,
  CategoryTreeNode,
} from '@/services/admin/blog';
import { Blog, BlogTag } from '@/types';

/**
 * 博客表单 Props
 */
interface BlogFormProps {
  /** 编辑模式时的博客ID */
  blogId?: number;
  /** 初始数据（用于编辑模式） */
  initialData?: Blog;
}

/**
 * 博客表单组件
 * 用于新增和编辑博客
 */
export default function BlogForm({ blogId, initialData }: BlogFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  // 表单状态
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState<number>(initialData?.categoryId || 0);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    initialData?.tags?.map((t) => t.id) || []
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');

  // 选项数据
  const [categories, setCategories] = useState<CategoryTreeNode[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);

  // UI状态
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // 加载分类和标签
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoading(true);
    try {
      const [categoriesData, tagsData] = await Promise.all([
        adminCategoryService.getCategoryTree(),
        adminTagService.getTags(),
      ]);
      // 扁平化分类树，保留层级信息用于显示
      const flattenTree = (nodes: CategoryTreeNode[], level = 0): CategoryTreeNode[] => {
        const result: CategoryTreeNode[] = [];
        nodes.forEach((node) => {
          result.push({ ...node, level });
          if (node.children && node.children.length > 0) {
            result.push(...flattenTree(node.children, level + 1));
          }
        });
        return result;
      };
      setCategories(flattenTree(categoriesData || []));
      setTags(tagsData);
    } catch (error) {
      console.error('加载选项失败:', error);
      showError('加载分类和标签失败');
    } finally {
      setLoading(false);
    }
  };

  // 自动保存草稿
  const handleAutoSave = async (newContent: string) => {
    if (!title.trim()) return; // 没有标题不自动保存

    try {
      const data: BlogRequest = {
        title,
        summary,
        content: newContent,
        categoryId,
        tagIds: selectedTagIds,
        coverImage,
        videoUrl,
        status: 0, // 草稿
      };

      if (blogId) {
        await adminBlogService.updateBlog(blogId, data);
      } else {
        const created = await adminBlogService.createBlog(data);
        // 创建成功后跳转到编辑页面
        router.replace(`/admin/blogs/edit?id=${created.id}`);
      }
    } catch (error) {
      console.error('自动保存失败:', error);
    }
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      showError('请输入博客标题');
      return;
    }

    setSaving(true);
    try {
      const data: BlogRequest = {
        title,
        summary,
        content,
        categoryId,
        tagIds: selectedTagIds,
        coverImage,
        videoUrl,
        status: 0,
      };

      if (blogId) {
        await adminBlogService.updateBlog(blogId, data);
        showSuccess('草稿保存成功');
      } else {
        const created = await adminBlogService.createBlog(data);
        showSuccess('草稿保存成功');
        router.replace(`/admin/blogs/edit?id=${created.id}`);
      }
    } catch (error) {
      showError('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 发布博客
  const handlePublish = async () => {
    if (!title.trim()) {
      showError('请输入博客标题');
      return;
    }
    if (!content.trim()) {
      showError('请输入博客内容');
      return;
    }
    if (!categoryId) {
      showError('请选择分类');
      return;
    }

    setPublishing(true);
    try {
      const data: BlogRequest = {
        title,
        summary,
        content,
        categoryId,
        tagIds: selectedTagIds,
        coverImage,
        videoUrl,
        status: 1, // 发布
      };

      if (blogId) {
        await adminBlogService.updateBlog(blogId, data);
        await adminBlogService.publishBlog(blogId);
      } else {
        const created = await adminBlogService.createBlog(data);
        await adminBlogService.publishBlog(created.id);
      }

      showSuccess('发布成功');
      router.push('/admin/blogs');
    } catch (error) {
      showError('发布失败');
    } finally {
      setPublishing(false);
    }
  };

  // 切换标签选择
  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* 顶部标题栏 */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-secondary-200 p-4">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入博客标题..."
            className="flex-1 text-xl font-semibold border-none focus:outline-none focus:ring-0 placeholder:text-secondary-400"
          />
          <span
            className={clsx(
              'px-2 py-1 text-xs rounded-full',
              initialData?.status === 1
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            )}
          >
            {initialData?.status === 1 ? '已发布' : '草稿'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/admin/blogs')}
            className="px-4 py-2 text-sm text-secondary-600 hover:text-secondary-800"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 text-sm border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存草稿'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
          >
            {publishing ? '发布中...' : '发布'}
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧：编辑器 */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden min-h-0">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            onAutoSave={handleAutoSave}
            autoSaveInterval={5000}
            placeholder="请输入博客内容，支持 Markdown 格式..."
          />
        </div>

        {/* 右侧：设置面板 */}
        <div className="w-80 border-l border-secondary-200 bg-secondary-50 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-secondary-700 mb-4">博客设置</h3>

          {/* 摘要 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-600 mb-1">
              摘要
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="请输入博客摘要..."
              rows={3}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* 分类 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-600 mb-1">
              分类 <span className="text-red-500">*</span>
            </label>
            {loading ? (
              <div className="text-sm text-secondary-400">加载中...</div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value={0}>请选择分类</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} disabled={!cat.isLeaf}>
                    {'　'.repeat(cat.level || 0)}
                    {cat.level && cat.level > 0 ? '└ ' : ''}
                    {cat.name}
                    {!cat.isLeaf ? ' (父级分类)' : ''}
                  </option>
                ))}
              </select>
            )}
            <p className="mt-1 text-xs text-secondary-400">只能选择末级分类关联博客</p>
          </div>

          {/* 标签 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-600 mb-1">
              标签
            </label>
            {loading ? (
              <div className="text-sm text-secondary-400">加载中...</div>
            ) : tags.length === 0 ? (
              <div className="text-sm text-secondary-400">暂无标签</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={clsx(
                      'px-2 py-1 text-xs rounded-full border transition-colors',
                      selectedTagIds.includes(tag.id)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-secondary-600 border-secondary-200 hover:border-primary-300'
                    )}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 封面图 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-600 mb-1">
              封面图URL
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {coverImage && (
              <div className="mt-2">
                <img
                  src={coverImage}
                  alt="封面预览"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* 视频链接 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-600 mb-1">
              视频链接
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=xxx"
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* 统计信息 */}
          {initialData && (
            <div className="mt-6 pt-4 border-t border-secondary-200">
              <h4 className="text-sm font-semibold text-secondary-700 mb-2">统计信息</h4>
              <div className="space-y-1 text-xs text-secondary-500">
                <p>浏览次数: {initialData.viewCount || 0}</p>
                <p>创建时间: {initialData.createTime || '-'}</p>
                <p>更新时间: {initialData.updateTime || '-'}</p>
                {initialData.publishTime && (
                  <p>发布时间: {initialData.publishTime}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
