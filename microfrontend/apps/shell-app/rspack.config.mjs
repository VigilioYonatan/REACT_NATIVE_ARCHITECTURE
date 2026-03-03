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
          port: 8081,
        },
      }),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'shell_app',
        remotes: {
          service_cobranzas:
            'service_cobranzas@http://localhost:9000/[platform]/service_cobranzas.container.bundle',
          service_legal:
            'service_legal@http://localhost:9001/[platform]/service_legal.container.bundle',
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: '18.2.0' },
          'react-native': { singleton: true, eager: true, requiredVersion: '0.73.0' },
        },
      }),
    ],
  };
};
