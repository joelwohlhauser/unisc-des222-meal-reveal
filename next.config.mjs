/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["sgtfht5vfdrvx9qx.public.blob.vercel-storage.com"],
  },
};

export default nextConfig;
