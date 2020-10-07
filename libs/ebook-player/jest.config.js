module.exports = {
  name: 'ebook-player',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ebook-player',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
