import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
      {
        pathname: "/images/homepage/products/**",
        search: "?v=20260827",
      },
      {
        pathname: "/images/homepage/collections/**",
        search: "?v=20260827",
      },
    ],
  },
};

export default nextConfig;
