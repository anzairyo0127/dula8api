const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "development",
  entry: {
    "js/app": "./src/public/ts/index.ts",
  },
  target: "web",
  //externals:[nodeExternals()],
  output: {
    filename: "./[name].js",
    path: path.resolve(process.cwd(), "src/public"),
    publicPath: "/",
  },
  devtool: "source-map",
  resolve: {
    fallback: {"crypto": require.resolve("crypto-browserify"),"stream": require.resolve("stream-browserify")},
    mainFields: ['browser', 'main', 'module'],
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx", ".scss",".mjs", ".mts",".d.ts"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                outputStyle: 'expanded',
              },
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/style.css',
      ignoreOrder: true,
    })
  ]
};
