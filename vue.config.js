var config_ = require('./src/modules/activity/common/config.ts')
const webpack = require('webpack')
module.exports = {
  //打包后资源路径配置
  publicPath: './',
  // 接口资源配置
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config_ = config_['build']
    } else {
      // 为开发环境修改配置...
      config_ = config_['dev']
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify(config_)
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        jquery: "jquery",
        "window.jQuery": "jquery"
      })
    )

  },

  devServer: {
    disableHostCheck: true,
  },
  pluginOptions: {
    apollo: {
      enableMocks: false,
      enableEngine: true
    }
  }

}