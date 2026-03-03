import { AppRegistry } from 'react-native';
import appConfig from './app.json';
import App from './src/App';

AppRegistry.registerComponent(appConfig.expo.name, () => App);
