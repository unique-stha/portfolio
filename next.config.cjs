/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod.spline.design',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    esmExternals: 'loose', // Add this line
  },
  // Update webpack config
  webpack: (config, { isServer }) => {
    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    
    // Add fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      'react-native-fs': false,
      child_process: false,
    };

    return config;
  },
};