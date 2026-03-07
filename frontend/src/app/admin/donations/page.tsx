'use client';

import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useToast } from '@/contexts/ToastContext';
import {
  adminDonationService,
  DonationQrcodeRequest,
} from '@/services/admin/feedback';
import { DonationQrCode, QrCodeType } from '@/types';

/**
 * 收款码管理页面
 */
export default function DonationsPage() {
  const { showSuccess, showError } = useToast();

  // 收款码列表
  const [qrcodes, setQrcodes] = useState<DonationQrCode[]>([]);
  const [loading, setLoading] = useState(true);

  // 弹窗状态
  const [showModal, setShowModal] = useState(false);
  const [editingQrcode, setEditingQrcode] = useState<DonationQrCode | null>(null);
  const [formData, setFormData] = useState<DonationQrcodeRequest>({
    type: 'WECHAT',
    name: '',
    qrcodeUrl: '',
    isShow: 1,
    sortOrder: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  // 加载收款码列表
  const loadQrcodes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminDonationService.getQrcodes();
      setQrcodes(data || []);
    } catch {
      showError('加载收款码列表失败');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadQrcodes();
  }, [loadQrcodes]);

  // 打开创建弹窗
  const handleCreate = () => {
    setEditingQrcode(null);
    setFormData({
      type: 'WECHAT',
      name: '',
      qrcodeUrl: '',
      isShow: 1,
      sortOrder: 0,
    });
    setShowModal(true);
  };

  // 打开编辑弹窗
  const handleEdit = (qrcode: DonationQrCode) => {
    setEditingQrcode(qrcode);
    setFormData({
      type: qrcode.type as QrCodeType,
      name: qrcode.name || '',
      qrcodeUrl: qrcode.qrcodeUrl,
      isShow: qrcode.isShow,
      sortOrder: qrcode.sortOrder,
    });
    setShowModal(true);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.qrcodeUrl.trim()) {
      showError('请输入二维码图片URL');
      return;
    }

    setSubmitting(true);
    try {
      if (editingQrcode) {
        await adminDonationService.updateQrcode(editingQrcode.id, formData);
        showSuccess('更新成功');
      } else {
        await adminDonationService.createQrcode(formData);
        showSuccess('创建成功');
      }
      setShowModal(false);
      loadQrcodes();
    } catch {
      showError(editingQrcode ? '更新失败' : '创建失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 切换展示状态
  const handleToggleShow = async (id: number) => {
    try {
      await adminDonationService.toggleShow(id);
      showSuccess('状态已更新');
      loadQrcodes();
    } catch {
      showError('操作失败');
    }
  };

  // 删除收款码
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除收款码「${name || '未命名'}」吗？`)) {
      return;
    }

    try {
      await adminDonationService.deleteQrcode(id);
      showSuccess('删除成功');
      loadQrcodes();
    } catch {
      showError('删除失败');
    }
  };

  // 获取类型名称
  const getTypeName = (type: string) => {
    switch (type) {
      case 'WECHAT':
        return '微信支付';
      case 'ALIPAY':
        return '支付宝';
      default:
        return type;
    }
  };

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'WECHAT':
        return 'bg-green-100 text-green-700';
      case 'ALIPAY':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary-800">收款码管理</h1>
          <p className="text-sm text-secondary-500 mt-1">
            共 {qrcodes.length} 个收款码
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          添加收款码
        </button>
      </div>

      {/* 收款码列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : qrcodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-secondary-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mb-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
            />
          </svg>
          <p>暂无收款码</p>
          <button
            onClick={handleCreate}
            className="mt-4 text-primary-500 hover:underline text-sm"
          >
            点击添加第一个收款码
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrcodes.map((qrcode) => (
            <div
              key={qrcode.id}
              className="bg-white rounded-lg border border-secondary-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* 二维码图片 */}
              <div className="relative aspect-square bg-secondary-50">
                <img
                  src={qrcode.qrcodeUrl}
                  alt={getTypeName(qrcode.type)}
                  className="w-full h-full object-contain"
                />
                {/* 状态标签 */}
                <div className="absolute top-2 right-2">
                  <span
                    className={clsx(
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      qrcode.isShow
                        ? 'bg-green-100 text-green-700'
                        : 'bg-secondary-100 text-secondary-600'
                    )}
                  >
                    {qrcode.isShow ? '展示中' : '已隐藏'}
                  </span>
                </div>
              </div>

              {/* 信息区 */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={clsx(
                      'inline-flex px-2 py-0.5 text-xs font-medium rounded',
                      getTypeColor(qrcode.type)
                    )}
                  >
                    {getTypeName(qrcode.type)}
                  </span>
                  <span className="text-sm font-medium text-secondary-800">
                    {qrcode.name || '未命名'}
                  </span>
                </div>
                <p className="text-xs text-secondary-400 mb-3">
                  排序: {qrcode.sortOrder}
                </p>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(qrcode)}
                    className="flex-1 px-3 py-1.5 text-sm text-primary-600 border border-primary-200 rounded hover:bg-primary-50"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleToggleShow(qrcode.id)}
                    className={clsx(
                      'flex-1 px-3 py-1.5 text-sm rounded border',
                      qrcode.isShow
                        ? 'text-yellow-600 border-yellow-200 hover:bg-yellow-50'
                        : 'text-green-600 border-green-200 hover:bg-green-50'
                    )}
                  >
                    {qrcode.isShow ? '隐藏' : '展示'}
                  </button>
                  <button
                    onClick={() => handleDelete(qrcode.id, qrcode.name || '')}
                    className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 创建/编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h2 className="text-lg font-semibold text-secondary-800">
                {editingQrcode ? '编辑收款码' : '添加收款码'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* 类型 */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as QrCodeType })
                  }
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="WECHAT">微信支付</option>
                  <option value="ALIPAY">支付宝</option>
                </select>
              </div>

              {/* 名称 */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  名称（选填）
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="例如：微信收款码"
                  maxLength={50}
                />
              </div>

              {/* 二维码URL */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  二维码图片URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.qrcodeUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, qrcodeUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入二维码图片的URL地址"
                  required
                />
                {formData.qrcodeUrl && (
                  <div className="mt-2 p-2 bg-secondary-50 rounded">
                    <img
                      src={formData.qrcodeUrl}
                      alt="预览"
                      className="w-24 h-24 mx-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/></svg>';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 排序 */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  排序顺序
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  min={0}
                />
                <p className="text-xs text-secondary-400 mt-1">
                  数字越小越靠前
                </p>
              </div>

              {/* 是否展示 */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isShow"
                  checked={formData.isShow === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, isShow: e.target.checked ? 1 : 0 })
                  }
                  className="rounded border-secondary-300"
                />
                <label htmlFor="isShow" className="text-sm text-secondary-700">
                  展示在打赏页面
                </label>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-secondary-200 text-secondary-600 rounded-lg hover:bg-secondary-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {submitting ? '提交中...' : editingQrcode ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
