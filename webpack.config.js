const path = require('path')
const Htmlplugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
module.exports = {
  //확장자 제외
  resolve : {
    extensions: ['.js', '.vue'],
    alias: {
      '~' : path.resolve(__dirname, 'src'),
      'assets' : path.resolve(__dirname, 'src/assets')
    }
  },
  //파일 진입점(상대경로)
  entry: './src/index.js',

  //결과물을 반환하는 설정
  output : {
    path:path.resolve(__dirname, 'docs'),
    filename:'main.js',
    clean: true
  },
  module : {
    rules: [
      {
        test : /\.vue$/,
        use : ['vue-loader']
      },
      {
        test : /\.s?css$/,
        use : [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test : /\.js$/,
        exclude: /node_modules/,
        use :[
          'babel-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use : [
          'file-loader'
        ]
      }
    ]
  },
  //번들링 후 결과물의 처리방식등 다양한 플러그인 설정
  plugins : [
    new Htmlplugin({
      template : './public/index.html'
    }),
    new CopyPlugin({
      patterns : [{
        from : './public/static'
      }]
    }),
    new VueLoaderPlugin()
  ],
  devServer : {
      host : 'localhost',
      port :3000,
      hot : true
  }
}
