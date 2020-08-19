const path = require('path')
// const fs = require('fs')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']
const BUILD_PAGE = process.env.BUILD_PAGE // 构建页面

let devServer = {
  proxy: { // 代理
    '/': {
      target: 'http://localhost:8080',//设置你调用的接口域名和端口号 别忘了加http
      ws: false,
      changeOrigin: true,
      pathRewrite: {}
    }
  }
}

let pages = {
  EDITOR: {
    entry: 'src/pages/editor/main.js', // 入口
    template: 'template/editor.html', // 模板
    filename: 'index.html' // 输出文件
  },
  H5: {
    entry: 'src/pages/h5/main.js', // 入口
    template: 'template/h5.html', // 模板
    filename: BUILD_PAGE ? 'index.html' : 'h5.html' // 输出文件
  }
}

if (BUILD_PAGE) {
  pages = { index: pages[BUILD_PAGE] }
}

module.exports = {
  devServer: devServer,
  publicPath: process.env.BUILD_PAGE === 'EDITOR' ? '/activity/design/' : '/',
  // 输出文件目录
  assetsDir: 'static',
  // 修改 pages 入口
  pages,
  // css: {
  //   loaderOptions: {
  //     scss: {
  //       // @/ 是 src/ 的别名
  //       // data: fs.readFileSync(path.resolve(__dirname, `./src/pages/editor/common/styles/variables.scss`), 'utf-8') // 公共变量文件注入
  //       prependData: `@import "./src/pages/editor/common/styles/variables.scss"` // 公共变量文件注入
  //     }
  //   }
  // },
  productionSourceMap: process.env.NODE_ENV !== 'production',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
      // config.plugins.push(
      // 	new CompressionWebpackPlugin({
      // 		filename: '[path].gz[query]', // 提示示compression-webpack-plugin@3.0.0的话asset改为filename
      // 		algorithm: 'gzip',
      // 		beta: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      // 		threshold: 10240,
      // 		minRatio: 0.8
      // 	})
      // );

    } else {
      // 开发环境
    }
  },

  // 扩展 webpack 配置
  chainWebpack: config => {
    // @ 默认指向 src 目录，这里要改成 examples
    // 另外也可以新增一个 ~ 指向 packages
    config.resolve.alias
      .set('@', path.resolve('src'))
      .set('@editor', path.resolve('src/pages/editor'))
      .set('@plugins', path.resolve('plugins'))
    config.module
      .rule('js')
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/pages/editor/common/styles/variables.scss'),
        path.resolve(__dirname, './src/constant/constant.scss')
      ]
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-plugin-px2rem')({
            rootValue: 37.5, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: /(node_module)|(src\/pages\/editor)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 3 //设置要替换的最小像素值(3px会被转rem)。 默认 0
          })
        ]
      }
    }
  }
}
