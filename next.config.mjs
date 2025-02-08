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
  eslint: {
    // Ignoriert ESLint-Fehler während des Builds
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false, // Deaktiviert Source Maps für geringeren Speicherverbrauch
  experimental: {
    workerThreads: false, // Deaktiviert Worker Threads zur Reduzierung des RAM-Verbrauchs
    cpus: 1,              // Limitiert die Anzahl der verwendeten CPU-Kerne
  },
  output: 'standalone',    // Optimiert den Build für eine schlankere, standalone Ausführung
};

export default nextConfig;
