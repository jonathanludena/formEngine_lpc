module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'forms',
        'claim',
        'quote',
        'events',
        'components',
        'atoms',
        'molecules',
        'ui',
        'schemas',
        'types',
        'theme',
        'build',
        'deps',
        'release'
      ]
    ],
    'scope-empty': [2, 'never']
  }
};
