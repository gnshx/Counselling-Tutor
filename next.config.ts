import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '0.0.0.0',
    '0.0.0.0:3000',
    '0.0.0.0:3001',
    '0.0.0.0:3002',
    '0.0.0.0:3003',
    '10.50.36.34',
    '10.50.36.34:3000',
    '10.50.36.34:3001',
    '10.50.36.34:3002',
    '10.50.36.34:3003',
    'localhost',
    '127.0.0.1',
  ],
};

export default nextConfig;
