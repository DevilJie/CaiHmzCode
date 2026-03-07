import AdminLayout from '@/components/admin/AdminLayout';

/**
 * 管理后台布局
 * 所有 /admin 路由下的页面都使用此布局
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
