import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@repo/ui',
    '@repo/auth',
    '@repo/validation',
    '@repo/email',
  ],
  experimental: {
    optimizePackageImports: ['@repo/ui'],
  },
  eslint: {
    // Only run ESLint on specific directories during build
    dirs: ['app', 'components', 'lib'],
    // Don't fail the build on ESLint errors (warnings in test files won't block)
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Don't fail on type errors during build
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);
