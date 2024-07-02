module.exports = {
  displayName: 'Tests Typescript Application - Service',
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/tests/**/?(*.)+(spec|test).[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/tests/setup-tests.ts"],
};
