'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BlogForm from '@/components/admin/blog/BlogForm';
import { adminBlogService } from '@/services/admin/blog';
import { Blog } from '@/types';
import Loading from '@/components/ui/Loading';

/**
 * 编辑博客页面
 */
export default function EditBlogPage() {
  const params = useParams();
  const blogId = Number(params.id);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (blogId) {
      loadBlog();
    }
  }, [blogId]);

  const loadBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminBlogService.getBlogById(blogId);
      setBlog(data);
    } catch (err) {
      setError('加载博客失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-secondary-500">
        <p>{error}</p>
        <button
          onClick={loadBlog}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          重新加载
        </button>
      </div>
    );
  }

  return <BlogForm blogId={blogId} initialData={blog || undefined} />;
}
