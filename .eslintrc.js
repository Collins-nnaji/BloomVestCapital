module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    // Add any custom rules here
    'import/no-anonymous-default-export': 'off',
    'react-hooks/exhaustive-deps': 'warn'
  }
}; 