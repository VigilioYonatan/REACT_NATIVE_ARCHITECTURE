import * as path from 'path';
import * as Repack from '@callstack/repack';

const dirname = Repack.getDirname(import.meta.url);

/** @type {import('@rspack/cli').Configuration} */
export default (env) => {
  const {
    mode = 'development',
    context = dirname,
    platform = process.env.PLATFORM || 'android',
  } = env;

  return {
    mode,
    context,
    entry: './index.js',
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({ platform }),
    },
    optimization: {
      chunkIds: 'named',
    },
    plugins: [
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer: {
          port: 9001,
        },
      }),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'service_legal',
        filename: 'service_legal.container.bundle',
        exposes: {
          './App': './src/App.tsx',
        },
        shared: {
          react: { singleton: true, eager: false, requiredVersion: '18.2.0' },
          'react-native': { singleton: true, eager: false, requiredVersion: '0.73.0' },
        },
      }),
    ],
  };
};
