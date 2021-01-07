// As per https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-plugin
module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Preservica APIs demo';
      return args;
    });
  },
  // For GitHub Pages; https://cli.vuejs.org/guide/deployment.html#github-pages
  publicPath: process.env.NODE_ENV === 'production' ? '/preservica-api-demo/' : '/',

  devServer: {
    // This will use port 9091 and up if already in use
    port: 9090,
    proxy: {
      '^/proxy/': {
        // Required, but `router` will be used
        target: 'see router',
        router: function (req) {
          // Proxy `/proxy/https://eu.preservica.com/a/b/c` to `https://eu.preservica.com/a/b/c`
          return req.originalUrl.substr('/proxy/'.length);
        },
        // Do not append the path to the result of the router function, which already includes it
        pathRewrite: {'.*': ''},
        changeOrigin: true,
      },
    },
  },
};
