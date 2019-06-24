module.exports = {
    baseUrl: '',
    outputDir: 'build',
    configureWebpack: {
        target: 'electron-renderer',
        node: {
            __dirname: false
        }
    }
}