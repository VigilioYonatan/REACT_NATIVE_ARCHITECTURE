import { Script, ScriptManager } from '@callstack/repack/client';
import { AppRegistry } from 'react-native';
import appConfig from './app.json';
import App from './src/App';

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  let url;
  if (caller === 'service_cobranzas') {
    url = Script.getRemoteURL(
      `http://localhost:9000/[platform]/service_cobranzas.container.bundle`,
    );
  } else if (caller === 'service_legal') {
    url = Script.getRemoteURL(`http://localhost:9001/[platform]/service_legal.container.bundle`);
  }

  if (url) {
    return { url, cache: false, query: { platform: 'android' } };
  }
});

AppRegistry.registerComponent(appConfig.expo.name, () => App);
