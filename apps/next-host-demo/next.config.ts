import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React 19 configuration
  reactStrictMode: true,
  
  // Output configuration for optimal production build
  output: 'standalone',
  
  // Security: Allow dev origins (CVE-2025-48068 mitigation)
  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000'],
  
  // Experimental features
  experimental: {
    // Enable Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Webpack configuration to ignore problematic files from libsql
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Client-side: ignore server-only packages
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    } else {
      // Server-side: externalize libsql packages to avoid bundling issues
      config.externals = config.externals || [];
      if (typeof config.externals === 'object' && !Array.isArray(config.externals)) {
        config.externals = [config.externals];
      }
      config.externals.push({
        '@libsql/client': 'commonjs @libsql/client',
        'libsql': 'commonjs libsql',
        '@prisma/adapter-libsql': 'commonjs @prisma/adapter-libsql',
      });
    }
    
    // Handle .md files as assets
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });
    
    // Suppress specific warnings
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve 'encoding'/,
    ];
    
    return config;
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
