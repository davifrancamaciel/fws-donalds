import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "u9a6wmr3as.ufs.sh" },
      { hostname: "services-integrator-api-prd-public.s3.amazonaws.com" },
      { hostname: "services-integrator-api-dev-public.s3.amazonaws.com" },
    ],
  },
};

export default nextConfig;
