/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片域名配置
  images: {
    domains: ['localhost', '192.168.31.7'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // API代理配置 - 开发环境代理到后端8080端口
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
  // 严格模式
  reactStrictMode: true,
  // 输出配置（如需静态导出可修改）
  // output: 'export',
};

module.exports = nextConfig;
