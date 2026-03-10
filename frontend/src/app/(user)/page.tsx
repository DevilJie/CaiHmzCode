'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services';
import { ProjectGrid } from '@/components/project';
import { BannerCarousel, PopupAd } from '@/components/ad';

/**
 * 首页 - Editorial Magazine 风格
 * 沉浸式Hero区域 + 功能卡片 + 精选项目
 */
export default function HomePage() {

  // 获取首页展示的项目（取前6个）
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', 'home'],
    queryFn: () => projectService.getProjects({ pageNum: 1, pageSize: 6 }),
    staleTime: 5 * 60 * 1000,
  });

  const projects = projectsData?.list || [];
  const totalProjects = projectsData?.total || 0;

  /**
   * 功能卡片数据 - 采用更现代的图标和渐变色
   */
  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
      title: '项目展示',
      description: '探索AI驱动的创新项目，包含完整源码和技术文档',
      href: '/projects',
      gradient: 'from-violet-500 to-purple-600',
      boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      title: '技术博客',
      description: '深度技术文章，分享前端、后端、AI领域知识',
      href: '/blogs',
      gradient: 'from-blue-500 to-cyan-500',
      boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      title: '意见反馈',
      description: '分享您的想法和建议，帮助我们持续改进',
      href: '/feedback',
      gradient: 'from-emerald-500 to-teal-500',
      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      title: '支持作者',
      description: '如果内容有帮助，欢迎打赏支持持续创作',
      href: '/donation',
      gradient: 'from-rose-500 to-pink-500',
      boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.4)',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      {/* 弹窗广告 */}
      <PopupAd />

      {/* Hero Section - 沉浸式设计 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* 徽章 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="text-sm font-medium text-white/80">35岁程序员的技术分享平台</span>
            </div>

            {/* 主标题 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
              探索
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent"> AI 驱动</span>
              <br />
              的技术世界
            </h1>

            {/* 副标题 */}
            <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              记录AI开发项目、技术博客、学习心得
              <br className="hidden sm:block" />
              与开发者社区分享成长的每一步
            </p>

            {/* CTA 按钮组 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
                浏览项目
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/blogs"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                阅读博客
              </Link>
            </div>

            {/* 统计数据 */}
            <div className="mt-16 flex items-center justify-center gap-8 sm:gap-12">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">{totalProjects}+</div>
                <div className="text-sm text-white/50 mt-1">开源项目</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">100+</div>
                <div className="text-sm text-white/50 mt-1">技术文章</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/50 mt-1">持续更新</div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部波浪装饰 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-slate-50 dark:fill-dark-800">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* 轮播广告 */}
      <section className="px-4 py-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-800 dark:via-dark-900 dark:to-dark-800">
        <div className="max-w-7xl mx-auto">
          <BannerCarousel />
        </div>
      </section>

      {/* 功能卡片区域 */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-dark-800 dark:via-dark-900 dark:to-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 区域标题 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              探索更多内容
            </h2>
            <p className="text-slate-500 dark:text-dark-400 max-w-2xl mx-auto">
              发现精选项目、深度技术文章，或与我们分享您的想法
            </p>
          </div>

          {/* 功能卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group relative bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-100 dark:border-dark-700 hover:border-slate-200 dark:hover:border-dark-600 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-dark-900/50 transition-all duration-500 overflow-hidden"
              >
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* 图标 */}
                <div
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: feature.boxShadow }}
                >
                  {feature.icon}
                </div>

                {/* 标题 */}
                <h3 className="relative text-lg font-bold text-slate-800 dark:text-dark-100 mb-2 group-hover:text-slate-900 dark:group-hover:text-white">
                  {feature.title}
                </h3>

                {/* 描述 */}
                <p className="relative text-sm text-slate-500 dark:text-dark-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* 箭头指示 */}
                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-slate-50 dark:bg-dark-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <svg className="w-4 h-4 text-slate-400 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Hover 底部渐变条 */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 精选项目区域 */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 区域标题 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                精选项目
              </h2>
              <p className="text-slate-500 dark:text-dark-400">
                探索最新的AI驱动项目
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-dark-700 hover:bg-slate-200 dark:hover:bg-dark-600 text-slate-700 dark:text-dark-200 font-medium rounded-xl transition-colors"
            >
              查看全部
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* 项目网格 */}
          <ProjectGrid projects={projects} loading={isLoading} />
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            准备好开始了吗？
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            探索更多精彩内容，发现AI驱动的无限可能
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-slate-100 transition-all shadow-xl"
            >
              开始探索
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
