module.exports = {
  // testRegex: '\*.test.js$',
  reporters: ['default'],
  coverageDirectory: './coverage',
  coverageReporters: ['html'],
  collectCoverageFrom: [
    '*.js',
    '!.test.js'
  ],
  moduleNameMapper: {
    '^@siteroot(.*)$': '<rootDir>/src/site$1',
    '^@components(.*)$': '<rootDir>/src/site/components$1',
    '^@hocs(.*)$': '<rootDir>/src/site/hocs$1',
    '^@types(.*)$': '<rootDir>/src/site/types$1'
  },
  setupFiles: ['./setupEnzyme.js'],
  // snapshotSerializers: ['enzyme-to-json/serializer']
};
