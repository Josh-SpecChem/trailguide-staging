import type { NextConfig } from "next";
import withMDX from "@next/mdx";

// MDX support for both .mdx and .md files
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // Add any additional Next.js config options here
  // experimental: { appDir: true }, // Uncomment if you use app directory
};

export default withMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // rehypePlugins: [],
    // remarkPlugins: [],
    // Add your MDX plugin options if needed
  }
})(nextConfig);