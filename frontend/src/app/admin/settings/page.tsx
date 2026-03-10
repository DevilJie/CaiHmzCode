'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { systemConfigService } from '@/services/admin/settings';
import { SystemConfigResponse, SystemConfigRequest } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import clsx from 'clsx';

/**
 * 系统设置页面
 * 仅超级管理员可访问
 */
export default function SettingsPage() {
  const { isSuperAdmin } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SystemConfigResponse | null>(null);
  const [formData, setFormData] = useState<SystemConfigRequest>({
    siteName: '',
    icpNumber: '',
    footerText: '',
    githubToken: '',
    logoType: 'text',
    logoImageUrl: '',
    navHomeEnabled: true,
    navProjectsEnabled: true,
    navBlogsEnabled: true,
    navFeedbackEnabled: true,
    navDonationEnabled: true,
  });

  // 加载配置
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await systemConfigService.getSystemConfigs();
      setConfig(data);
      setFormData({
        siteName: data.siteName || '',
        icpNumber: data.icpNumber || '',
        footerText: data.footerText || '',
        githubToken: data.githubToken || '',
        logoType: data.logoType || 'text',
        logoImageUrl: data.logoImageUrl || '',
        navHomeEnabled: data.navHomeEnabled ?? true,
        navProjectsEnabled: data.navProjectsEnabled ?? true,
        navBlogsEnabled: data.navBlogsEnabled ?? true,
        navFeedbackEnabled: data.navFeedbackEnabled ?? true,
        navDonationEnabled: data.navDonationEnabled ?? true,
      });
    } catch (error) {
      showToast('error', '加载配置失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.siteName.trim()) {
      showToast('error', '网站名称不能为空');
      return;
    }

    try {
      setSaving(true);
      await systemConfigService.updateSystemConfigs(formData);
      showToast('success', '配置保存成功');
      loadConfig();
    } catch (error) {
      showToast('error', '保存配置失败');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // 权限检查
  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-600">您没有权限访问此页面</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">系统设置</h1>
        <p className="mt-1 text-secondary-500">配置网站基本信息和系统参数</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* 网站信息配置 */}
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-4 text-lg font-semibold text-secondary-800">
              网站信息
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-secondary-700">
                  网站名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) =>
                    setFormData({ ...formData, siteName: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入网站名称"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-secondary-700">
                  ICP备案号
                </label>
                <input
                  type="text"
                  value={formData.icpNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, icpNumber: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="如：京ICP备XXXXXXXX号"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-secondary-700">
                  页脚文字
                </label>
                <textarea
                  value={formData.footerText}
                  onChange={(e) =>
                    setFormData({ ...formData, footerText: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="页脚显示的版权信息"
                />
              </div>
            </div>
          </div>

          {/* GitHub配置 */}
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-4 text-lg font-semibold text-secondary-800">
              GitHub配置
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-secondary-700">
                  GitHub Token
                </label>
                <input
                  type="password"
                  value={formData.githubToken}
                  onChange={(e) =>
                    setFormData({ ...formData, githubToken: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="用于获取GitHub README的Personal Access Token"
                />
                <p className="mt-1 text-xs text-secondary-500">
                  用于同步GitHub项目README内容，需要repo权限
                </p>
              </div>
            </div>
          </div>

          {/* Logo配置 */}
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-4 text-lg font-semibold text-secondary-800">
              Logo配置
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Logo类型
                </label>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="logoType"
                      value="text"
                      checked={formData.logoType === 'text'}
                      onChange={(e) =>
                        setFormData({ ...formData, logoType: e.target.value as 'text' | 'image' })
                      }
                      className="h-4 w-4 border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-700">文字Logo</span>
                  </label>
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="logoType"
                      value="image"
                      checked={formData.logoType === 'image'}
                      onChange={(e) =>
                        setFormData({ ...formData, logoType: e.target.value as 'text' | 'image' })
                      }
                      className="h-4 w-4 border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-700">图片Logo</span>
                  </label>
                </div>
                <p className="mt-1 text-xs text-secondary-500">
                  选择文字Logo将显示网站名称，选择图片Logo将显示自定义图片
                </p>
              </div>

              {formData.logoType === 'image' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-secondary-700">
                    Logo图片URL
                  </label>
                  <input
                    type="text"
                    value={formData.logoImageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, logoImageUrl: e.target.value })
                    }
                    className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="请输入Logo图片的URL地址"
                  />
                  <p className="mt-1 text-xs text-secondary-500">
                    支持jpg、png、svg等格式，建议使用透明背景图片
                  </p>
                  {formData.logoImageUrl && (
                    <div className="mt-3">
                      <p className="mb-1 text-xs text-secondary-500">预览：</p>
                      <img
                        src={formData.logoImageUrl}
                        alt="Logo预览"
                        className="h-12 max-w-xs rounded border border-secondary-200 bg-white p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 导航配置 */}
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-4 text-lg font-semibold text-secondary-800">
              导航配置
            </h2>
            <p className="mb-4 text-sm text-secondary-500">
              控制前台页面导航栏中各菜单项的显示与隐藏
            </p>
            <div className="space-y-4">
              {/* 首页开关 */}
              <div className="flex items-center justify-between rounded-lg border border-secondary-200 p-3">
                <div>
                  <span className="font-medium text-secondary-800">首页</span>
                  <p className="text-xs text-secondary-500">显示首页导航链接</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, navHomeEnabled: !formData.navHomeEnabled })
                  }
                  className={clsx(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    formData.navHomeEnabled ? 'bg-primary-600' : 'bg-secondary-300'
                  )}
                >
                  <span
                    className={clsx(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      formData.navHomeEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* 项目开关 */}
              <div className="flex items-center justify-between rounded-lg border border-secondary-200 p-3">
                <div>
                  <span className="font-medium text-secondary-800">项目</span>
                  <p className="text-xs text-secondary-500">显示项目导航链接</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, navProjectsEnabled: !formData.navProjectsEnabled })
                  }
                  className={clsx(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    formData.navProjectsEnabled ? 'bg-primary-600' : 'bg-secondary-300'
                  )}
                >
                  <span
                    className={clsx(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      formData.navProjectsEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* 博客开关 */}
              <div className="flex items-center justify-between rounded-lg border border-secondary-200 p-3">
                <div>
                  <span className="font-medium text-secondary-800">博客</span>
                  <p className="text-xs text-secondary-500">显示博客导航链接</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, navBlogsEnabled: !formData.navBlogsEnabled })
                  }
                  className={clsx(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    formData.navBlogsEnabled ? 'bg-primary-600' : 'bg-secondary-300'
                  )}
                >
                  <span
                    className={clsx(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      formData.navBlogsEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* 反馈开关 */}
              <div className="flex items-center justify-between rounded-lg border border-secondary-200 p-3">
                <div>
                  <span className="font-medium text-secondary-800">反馈</span>
                  <p className="text-xs text-secondary-500">显示反馈导航链接</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, navFeedbackEnabled: !formData.navFeedbackEnabled })
                  }
                  className={clsx(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    formData.navFeedbackEnabled ? 'bg-primary-600' : 'bg-secondary-300'
                  )}
                >
                  <span
                    className={clsx(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      formData.navFeedbackEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* 打赏开关 */}
              <div className="flex items-center justify-between rounded-lg border border-secondary-200 p-3">
                <div>
                  <span className="font-medium text-secondary-800">打赏</span>
                  <p className="text-xs text-secondary-500">显示打赏导航链接</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, navDonationEnabled: !formData.navDonationEnabled })
                  }
                  className={clsx(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    formData.navDonationEnabled ? 'bg-primary-600' : 'bg-secondary-300'
                  )}
                >
                  <span
                    className={clsx(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      formData.navDonationEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 配置项列表 */}
          {config?.configs && config.configs.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow-card">
              <h2 className="mb-4 text-lg font-semibold text-secondary-800">
                所有配置项
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500">
                        配置名称
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500">
                        配置键
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500">
                        描述
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {config.configs.map((item) => (
                      <tr key={item.configKey}>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-secondary-800">
                          {item.configName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-secondary-600">
                          {item.configKey}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary-500">
                          {item.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 保存按钮 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={clsx(
                'rounded-lg px-6 py-2 font-medium text-white transition-colors',
                saving
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              )}
            >
              {saving ? '保存中...' : '保存配置'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
