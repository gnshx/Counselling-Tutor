import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '10.50.37.225',
    '10.50.37.225:3000',
    '10.50.37.225:3001',
    '10.50.40.151',
    '10.50.36.230',
    '10.50.36.230:3001',
    'localhost',
    'localhost:3000',
    'localhost:3001',
    '127.0.0.1',
    '0.0.0.0',
  ],
};

export default nextConfig;
