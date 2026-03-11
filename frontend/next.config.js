/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置
  output: 'export',

  // 图片配置 - 静态导出时禁用图片优化
  images: {
    unoptimized: true,
  },

  // 严格模式
  reactStrictMode: false,
};

module.exports = nextConfig;
