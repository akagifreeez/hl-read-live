/** @type {import('next').NextConfig} */
// `standalone` emits a self-contained server (.next/standalone) so the
// production image can ship just node + the server, no full node_modules.
const nextConfig = { reactStrictMode: true, output: "standalone" };
export default nextConfig;
