module.exports = {
    semi: true, // 未尾分号
    singleQuote: false, // 单引号
    quoteProps: 'as-needed',
    trailingComma: 'none', // 末尾逗号

    // 重点是这一个要配置为auto
    endOfLine: 'auto',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
}