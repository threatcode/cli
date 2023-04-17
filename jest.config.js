const { createJestConfig } = require('./test/createJestConfig');

module.exports = createJestConfig({
  displayName: 'threatcode',
  projects: ['<rootDir>', '<rootDir>/packages/*'],
});
