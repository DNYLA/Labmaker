//This webpack file is currently not loaded in
//To load it in go to Project.json and change the webpack file to this files locations
const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
module.exports = (config, context) => {
  nrwlConfig(config);
  return {
    ...config,
    // node: {
    //   Buffer: true,
    // },
    // resolve: {
    //   fallback: {
    //     os: false,
    //   },
    // },
    plugins: [
      ...config.plugins,
      //   new webpack.DefinePlugin({
      //     'process.env': {
      //       // This has effect on the react lib size
      //       NODE_ENV: JSON.stringify('development'),
      //     },
      //   }),
      //   new Dotenv({ systemvars: true, path: './.env' }),
    ],
  };
};
