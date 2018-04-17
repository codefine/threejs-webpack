module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": [0],
        "indent": ["error", "tab"], // 使用tab缩进
        "linebreak-style": ["error", "unix"], // 使用unix(LF)换行符 
        "quotes": ["error", "single"], // 使用单引号
        "semi": ["error", "always"], // 使用分号
        "no-var": ["error"], // 禁用var关键字
        "arrow-spacing": ["error", { "before": true, "after": true }], // 箭头函数两侧空格: 至少有一个，并且两侧保持一致
        "no-empty-function": ["error", { "allow": ["constructors"] }] // 不允许出现空函数(constructor除外)
    }
};