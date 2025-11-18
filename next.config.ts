import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
            domains: ['placehold.co', 'drive.google.com', 'lh3.googleusercontent.com'],
          },
           typescript: {
        ignoreBuildErrors: true,
      },
};

export default nextConfig;
