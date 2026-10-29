import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  // Keep output tracing inside this project when other npm lockfiles exist nearby.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
