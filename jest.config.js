module.exports = {
  // testRegex: '\*.test.js$',
  reporters: ['default'],
  coverageDirectory: './coverage',
  coverageReporters: ['html'],
  collectCoverageFrom: [
    '*.js',
    '!.test.js'
  ],
  setupFiles: ['./setupEnzyme.js'],
  // snapshotSerializers: ['enzyme-to-json/serializer']
};
