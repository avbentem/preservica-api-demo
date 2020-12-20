// As per https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-plugin
module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Preservica APIs demo';
      return args;
    });
  },
};
