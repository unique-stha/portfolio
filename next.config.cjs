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
    esmExternals: 'loose', 
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
    if (isServer) {
      config.externals = [...(config.externals || []), '@splinetool/react-spline'];
    }

    return config;
  },
  trailingSlash: true,
  assetPrefix: '',
};
module.exports = nextConfig;
