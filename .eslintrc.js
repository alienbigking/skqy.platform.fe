module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    // "no-debugger": process.env.NODE_ENV === "prod" ? "off" : "off",
    camelcase: 2,
    // curly: 2,
    curly: 'off',
    quotes: [2, 'single'],
    semi: [1, 'never'],
    eqeqeq: [2, 'allow-null'], // 使用 === 替代 ==
    'comma-dangle': ['error', 'never'],
    'eol-last': 2,
    'no-use-before-define': 0,
    'no-var': 0,
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'block-no-empty': 0
  }
}
