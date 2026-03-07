'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/contexts/ToastContext';
import { projectService } from '@/services';
import { ProjectGrid } from '@/components/project';
import { BannerCarousel, PopupAd } from '@/components/ad';

/**
 * 首页 - 欢迎页面
 * 展示网站主要功能入口和精选项目
 */
export default function HomePage() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  // 获取首页展示的项目（取前4个）
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', 'home'],
    queryFn: () => projectService.getProjects({ page: 0, size: 4 }),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  const projects = projectsData?.content || [];

  /**
   * 功能卡片数据
   */
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: '项目展示',
      description: '展示AI开发的精品项目，包含项目介绍、技术栈、源码链接',
      href: '/projects',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: '技术博客',
      description: '分享技术心得与经验，记录学习成长的点点滴滴',
      href: '/blogs',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: '意见反馈',
      description: '收集宝贵的意见建议，帮助网站不断改进完善',
      href: '/feedback',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: '支持作者',
      description: '如果觉得内容有帮助，欢迎打赏支持，持续输出优质内容',
      href: '/donation',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* 轮播广告 */}
      <section className="px-4 pt-6">
        <div className="max-w-7xl mx-auto">
          <BannerCarousel />
        </div>
      </section>

      {/* 弹窗广告 */}
      <PopupAd />

      {/* Hero区域 */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-blue-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            欢迎来到{' '}
            <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              技术分享站
            </span>
          </h1>

          {/* 副标题 */}
          <p className="text-lg md:text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            35岁程序员的技术分享平台，记录AI开发项目、技术博客、学习心得
          </p>

          {/* CTA按钮 */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/projects"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              浏览项目
            </Link>
            <Link
              href="/blogs"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              阅读博客
            </Link>
          </div>
        </div>
      </section>

      {/* 精选项目区域 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-900">
                精选项目
              </h2>
              <p className="text-secondary-500 mt-1">
                展示AI开发的精品项目
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <ProjectGrid
            projects={projects}
            loading={isLoading}
            emptyMessage="暂无精选项目"
          />

          {/* 移动端查看全部按钮 */}
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部项目
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 功能卡片区域 */}
      <section className="py-16 px-4 bg-secondary-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-12">
            主要功能
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="card hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${feature.bgColor} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 技术栈展示 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-8">
            技术栈
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { name: 'Next.js 14', color: 'bg-black text-white' },
              { name: 'React 18', color: 'bg-blue-500 text-white' },
              { name: 'TypeScript', color: 'bg-blue-600 text-white' },
              { name: 'Tailwind CSS', color: 'bg-cyan-500 text-white' },
              { name: 'React Query', color: 'bg-red-500 text-white' },
            ].map((tech) => (
              <span
                key={tech.name}
                className={`px-4 py-2 rounded-full text-sm font-medium ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
