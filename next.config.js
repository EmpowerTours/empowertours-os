/** @type {import("next").NextConfig} */
// Static export: served from Cloudflare Workers static assets (see worker/).
module.exports = { reactStrictMode: true, output: "export", images: { unoptimized: true } };
