const vueVersion = process.env.VUE_VERSION
module.exports = {
  roots: [
    '<rootDir>/packages',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  modulePathIgnorePatterns: [
    '/dist/',
  ],
  setupFiles: [
    '<rootDir>/packages/test-utils/test.setup.js',
  ],
  moduleNameMapper: {
    '^@ui-vue/adapter': `<rootDir>/packages/adapter/vue${vueVersion}.ts`,
    '^@ui-vue/(.*)$': '<rootDir>/packages/$1/index.ts',
    // mock vue to vue+vue-version
    'vue': 'vue' + vueVersion
  },
  testEnvironment: 'jsdom',
}
