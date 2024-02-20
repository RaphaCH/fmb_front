import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

rules.push({
  test: /\.s[ac]ss$/i,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'sass-loader',
    'postcss-loader',
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.scss'],
  },
};
