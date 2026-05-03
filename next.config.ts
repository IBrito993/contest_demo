import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Uncomment for production Docker build:
  // output: "standalone",
};

export default nextConfig;
