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
  experimental: {
    workerThreads: false, // Reduziert RAM-Verbrauch
    concurrentFeatures: false, // Verhindert zu viele parallele Prozesse
  },
};

export default nextConfig;
