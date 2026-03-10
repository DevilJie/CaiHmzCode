'use client';

import { useQuery } from '@tanstack/react-query';
import { systemService } from '@/services/system';

/**
 * Footer页脚组件
 * Editorial Magazine 风格
 *
 * 功能:
 * - 显示网站信息
 * - 显示ICP备案号（从系统配置获取）
 * - 显示版权信息
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // 获取网站信息
  const { data: siteInfo } = useQuery({
    queryKey: ['siteInfo'],
    queryFn: () => systemService.getSiteInfo(),
    staleTime: 10 * 60 * 1000, // 10分钟缓存
    retry: false,
  });

  const siteName = siteInfo?.siteName || '技术分享站';
  const icpNumber = siteInfo?.icpNumber || '';
  const footerText = siteInfo?.footerText || '35岁程序员的技术分享平台';

  return (
    <footer className="bg-secondary-800 text-secondary-300">
      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 网站介绍 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">{siteName}</span>
            </div>
            <p className="text-secondary-400 text-sm leading-relaxed max-w-md">
              {footerText}。分享技术心得、项目经验、编程技巧，记录程序员的成长之路。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/projects"
                  className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                >
                  项目展示
                </a>
              </li>
              <li>
                <a
                  href="/blogs"
                  className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                >
                  技术博客
                </a>
              </li>
              <li>
                <a
                  href="/feedback"
                  className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                >
                  意见反馈
                </a>
              </li>
              <li>
                <a
                  href="/donation"
                  className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                >
                  支持作者
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="border-t border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-secondary-400 text-sm">
                Copyright {currentYear} {siteName}. All rights reserved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              {icpNumber && (
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                >
                  {icpNumber}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
