const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.forEach((plugin) => {
        if (plugin instanceof InlineChunkHtmlPlugin) {
          plugin.tests = [/.+[.]js/]
          plugin.options = { inject: 'body' }
        }
      })

      const transpileModules = [
        /node_modules[\\/]@gluestack-ui[\\/]/,
        /node_modules[\\/]@gluestack-style[\\/]/,
        /node_modules[\\/]@legendapp[\\/]/,
        /node_modules[\\/]@spr-networks[\\/]plugin-ui[\\/]/
      ]
      webpackConfig.module.rules.forEach((rule) => {
        if (!rule.oneOf) return
        rule.oneOf.forEach((loader) => {
          const usesBabel =
            loader.loader && loader.loader.includes('babel-loader') && loader.include
          if (usesBabel) {
            loader.include = [].concat(loader.include, transpileModules)
          }
        })
      })

      const oneOfRuleIdx = webpackConfig.module.rules.findIndex((rule) => !!rule.oneOf)
      webpackConfig.module.rules[oneOfRuleIdx].oneOf.forEach((loader) => {
        if (
          loader.test &&
          loader.test.test &&
          (loader.test.test('test.module.css') || loader.test.test('test.module.scss'))
        ) {
          loader.use.forEach((use) => {
            if (use.loader && use.loader.includes('mini-css-extract-plugin')) {
              use.loader = require.resolve('style-loader')
            }
          })
        }
      })

      return webpackConfig
    }
  }
}
