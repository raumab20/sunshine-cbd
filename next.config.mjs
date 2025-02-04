const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    return config;
  },
  typescript: {
    // Ignoriert TypeScript-Fehler während des Builds
    ignoreBuildErrors: true,
  },
  env: {
    NODE_ENV: "production",
    NEXT_PUBLIC_ENV: "production",
  },
  experimental: {
    workerThreads: false, // Verhindert parallele Worker-Prozesse, spart RAM
    cpus: 1, // Reduziert CPU-Nutzung, begrenzt parallele Prozesse
  },
  output: 'standalone', // Erlaubt speichereffiziente Bereitstellung
};

export default nextConfig;
