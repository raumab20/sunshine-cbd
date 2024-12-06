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
};

export default nextConfig;
