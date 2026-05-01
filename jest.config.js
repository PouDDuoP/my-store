module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'api/services/**/*.js',
    'api/routes/**/*.js',
    'api/middleware/**/*.js'
  ],
  testMatch: ['**/tests/**/*.test.js'],
  silent: false,
  forceExit: true,
  resetModules: true,
  globalTeardown: undefined,
};
