const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "development",
  entry: './js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public/js')
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
      vuex: 'vuex/dist/vuex.js',
      chartjs: 'chart.js/dist/Chart.min.js',
      cryptojs: 'crypto-js/crypto-js.js'
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            // 'scss': 'vue-style-loader!css-loader!sass-loader',
            // 'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|png)$/,
        use: ["url-loader"]
      }
    ]
  }
};
