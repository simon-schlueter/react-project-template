"use strict";

const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { CheckerPlugin } = require("awesome-typescript-loader");

const tslintConfig = require("./tslint.json");
const watchMode = process.argv.indexOf("--watch") !== -1;

const webpackConfig = {
  context: __dirname,
  entry: {
    "app": "./src/index.ts"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devtool: process.env.NODE_ENV === "production" ? "source-map" : "eval-source-map",
  stats: {
    children: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["awesome-typescript-loader"]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: true,
                getLocalIdent: (context, localIdentName, localName, options) => {
                  if(!options.context) {
		                options.context = context.options && typeof context.options.context === "string" ? context.options.context : context.context;
                  }

                  let request = path.relative(path.join(__dirname, "src"), context.resourcePath);

                  request = request.replace(/\.[^/.]+$/, "");
                  request = request.replace(/\/index$/, "");
                  request = request.replace(/\//g, "_");
                  request = request.replace(/[^a-z0-9-_]/gi, "");

                  // [path]_[className]
                  // i.e. components_App_container
                  return `${request}_${localName}`;
                }
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[sha512:hash:base64:7]-[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
    }),
    new CheckerPlugin(),
    new ExtractTextPlugin("app.css"),
    new HtmlWebpackPlugin({ title: "My App" }),
    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          configuration: tslintConfig,
          failOnHint: true
        }
      }
    })
  ]
};

if (!watchMode) {
  webpackConfig.module.rules.push({
    test: /\.tsx?$/,
    enforce: "pre",
    use: ["tslint-loader"]
  });

  if (process.env.NODE_ENV === "production") {
    webpackConfig.plugins.push(new UglifyJSPlugin());
  }
}

module.exports = webpackConfig;
