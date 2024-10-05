// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Path to your Next.js app
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/actions/(.*)$": "<rootDir>/actions/$1",
    "^@/pages/(.*)$": "<rootDir>/pages/$1",
    "^@/styles/(.*)$": "<rootDir>/styles/$1",
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
    "^next-auth$": "<rootDir>/__mocks__/next-auth.ts", // Mock for root next-auth
    "^next-auth/(.*)$": "<rootDir>/__mocks__/next-auth/$1.js", // Mock for submodules
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    "/node_modules/(?!next-auth)"
  ],
};

export default createJestConfig(config);
