module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-plusplus': ["error", { 
      "allowForLoopAfterthoughts": true 
    }],
    'no-bitwise': 0,
    'no-underscore-dangle': ["error", { 
      "allowAfterThis": true 
    }],
    'no-console': ["error", { 
      allow: ["warn", "error"] 
    }],    
    'no-param-reassign': [2, { "props": false }],
    'no-void': ["error", { "allowAsStatement": false }],
    'no-return-assign': ["error", "always"],
  },
};
