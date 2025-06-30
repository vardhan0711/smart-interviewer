import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:{
    ignoreDuringBuilds:true,

  },
  typescript:{
    ignoreBuildErrors:true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
        os: false,
        path: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        util: false,
        assert: false,
        url: false,
        buffer: false,
        process: false,
        dns: false,
        dgram: false,
        module: false,
        constants: false,
        querystring: false,
        string_decoder: false,
        timers: false,
        events: false,
        domain: false,
        punycode: false,
        readline: false,
        repl: false,
        vm: false,
        worker_threads: false,
      };
    }
    return config;
  },
};

export default nextConfig;
