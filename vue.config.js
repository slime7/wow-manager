module.exports = {
  productionSourceMap: false,
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    https: false,
    disableHostCheck: true,
  },

  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        nsis: {
          oneClick: false,
        },
        win: {
          target: [
            {
              target: 'nsis',
              arch: [
                'x64',
              ],
            },
            {
              target: 'portable',
              arch: [
                'x64',
              ],
            },
          ],
        },
      },
    },
  },
};
