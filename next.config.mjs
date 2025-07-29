/** @type {import('next').NextConfig} */
const nextConfig = {
  // Conditional export based on environment
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' 
    ? { output: 'export', trailingSlash: true } 
    : {}),
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Configurações adicionais para melhor performance e segurança
  experimental: {
    typedRoutes: true,
  },
  // Headers de segurança
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
