const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const generate = require('generate-file-webpack-plugin')
const fs = require('fs')

function getInfos(envValues) {
  const appPackage = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')).toString());
  const info = {
    hosted_by: envValues.HOSTED_BY || "",
    hosted_by_name: envValues.HOSTED_BY_NAME || "",
    version: appPackage.version,
    country: envValues.COUNTRY || "",
    backend_addr: envValues.REACT_APP_NYM_CLIENT_SERVER || ""
  }
  return JSON.stringify(info)
}

module.exports = () => {

  let pluginList = [
    new HtmlWebpackPlugin({
      title: 'Pastenym',
      description: "Share text anonymously",
      public_url: "https://pastenym.ch",
      template: path.resolve(__dirname, './src/index.html'), // template file
      filename: 'index.html', // output file  
    }),
    new FaviconsWebpackPlugin({logo: './public/logo.svg',favicons: {
      appName: 'Pastenym',
      appDescription: 'Share text anonymously',
      developerName: 'No Trust Verify',
      developerURL: null, // prevent retrieving from the nearest package.json
      background: '#FFFFFF',
      theme_color: '#e8e5e1',
      icons: {
        coast: false,
        yandex: false
      },
      inject: true,
    }}),
    new CleanWebpackPlugin(),
    new Dotenv(),
    
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 9000000,
    }),
  ]

  // process.env contains the env variables from upstream (OS, docker, you-name-it,…)
  // Parse the .env file and add variables to the process.env
  var _ = require('dotenv').config({path: __dirname + '/.env'})

  // If instance owner does not want to expose the info.json file, we do not generate it
  if (process.env.hasOwnProperty("GENERATE_INFO_FILE_ABOUT_INSTANCE") && process.env.GENERATE_INFO_FILE_ABOUT_INSTANCE.toLowerCase() === "true") {
    console.log("Will generate info.json file as allowed.")
    // Using generate-file-webpack-plugin: works but old!
    pluginList.push(
      generate({
        file: 'info.json',
        content: getInfos(process.env)
    }))
  }

  return {
    entry: {
      main: path.resolve(__dirname, './src/index.js'),
      app: path.resolve(__dirname, './src/UserInput.js'),
      //worker: path.resolve(__dirname, './src/worker.js'),
      //bootstrap: path.resolve(__dirname, './src/bootstrap.js')
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].bundle.js',
    },
    mode: 'production',
    plugins: pluginList,
    module: {
      rules: [
        // JavaScript 
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        // Images
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name]-[hash][ext]'
          }
        },
        {
          test: /\.(png|jpg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name]-[hash][ext]'
          }
        },
        // Fonts and SVGs
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'asset/inline',
        },
        // CSS, PostCSS, and Sass  
        {
          test: /\.(scss|css)$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        },
      ],
      // According: https://github.com/bitwiseshiftleft/sjcl/issues/345#issuecomment-345640858
      noParse: [
        /sjcl\.js$/,
      ]
    },
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, './dist'),
      },
      open: false,
      compress: false,
      port: 8081,
    },
    experiments: {
      syncWebAssembly: true,
      topLevelAwait: true
    },
    performance: {
      maxEntrypointSize: 2012000,
      maxAssetSize: 200212000,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          }
        }
      }
    }
  }
}
