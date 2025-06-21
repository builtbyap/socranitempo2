/** @type {import('next').NextConfig} */

const nextConfig = {
  // Disable static generation for auth pages to prevent prerender errors
  experimental: {
    // Disable static generation for pages that use search params
    workerThreads: false,
    cpus: 1
  },
  
  // Ensure proper output for Vercel
  output: 'standalone',
  
  // Disable static optimization for auth pages
  async generateStaticParams() {
    return [];
  }
};

if (process.env.NEXT_PUBLIC_TEMPO) {
    nextConfig["experimental"] = {
        ...nextConfig.experimental,
        // NextJS 13.4.8 up to 14.1.3:
        // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
        // NextJS 14.1.3 to 14.2.11:
        swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]]

        // NextJS 15+ (Not yet supported, coming soon)
    }
}

module.exports = nextConfig;