const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const WebpackNotifierPlugin = require('webpack-notifier');
const Dotenv = require('dotenv-webpack');

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
      new Dotenv(),
      new WebpackNotifierPlugin({ title: 'Frontend Project build completed' }),
    ],
  };
};
