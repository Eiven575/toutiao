module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 解决Expected indentation of 2 spaces but found 4的错误
    indent: 0,
    // 解决error  Missing space before function parentheses  space-before-function-paren
    'space-before-function-paren': 0
  }
}
