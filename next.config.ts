import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/extension/iframe', // hoặc "/(.*)" nếu toàn bộ site được nhúng
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              'frame-ancestors https://note.funnycode.dev https://note.funnycode.vn https://funnycode.vn http://ftes.cloud http://localhost:3000 http://localhost:3003', // hoặc '*', nếu bạn chấp nhận tất cả
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // Hoặc bỏ nếu đã dùng CSP
          },
        ],
      },
    ];
  },
  allowedDevOrigins: [
    'https://note.funnycode.dev',
    'https://note.funnycode.vn',
    'https://funnycode.vn',
    'http://ftes.cloud',
    'http://localhost:3000',
    '*',
  ],
};

export default nextConfig;
