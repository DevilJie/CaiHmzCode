import UserLayout from '@/components/layout/UserLayout';

/**
 * 用户端路由组布局
 * 所有 (user) 路由组下的页面都使用此布局
 */
export default function UserRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
