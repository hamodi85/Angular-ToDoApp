module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: [
                    require('postcss-import'),
                    require('tailwindcss'),
                    require('autoprefixer'),
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  };
  