const path = require('path');

const overrideWebpackConfig = ({ webpackConfig, context }) => {
    context.paths = webpackConfig.output.path = path.resolve('./server/build');
    return webpackConfig;
};

module.exports = {
  plugins: [
    {
      plugin: { overrideWebpackConfig }
    }
  ]
};