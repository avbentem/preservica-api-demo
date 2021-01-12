import { createStore } from 'vuex';
import { localStoragePlugin } from './localStorage';

export interface Config {
  proxy: string;
  host: string;
  username: string;
  password: string;
  tenant: string;
}

export interface AppState {
  config: Config;
  persisted: boolean;
}

export default createStore<AppState>({
  // Be strict during development, but in production avoid the extra synchronous deep watcher on the
  // state tree to detect inappropriate mutations
  strict: process.env.NODE_ENV !== 'production',

  state: {
    config: {
      // The URL will be appended without any URL encoding. This needs to support complex values:
      // resumptionToken=metadataPrefix%3DXIP%26from%3D2020-01-01T00%3A00%3A00Z%26until%3D2030-12-31T23%3A59%3A59Z%26change%3D34312625
      proxy: 'https://proxy.arjanvanbentem.nl/',
      // With trailing slash
      host: 'https://eu.preservica.com/',
      username: '',
      password: '',
      tenant: '',
    },
    persisted: false,
  },
  getters: {
    /**
     * Indicate if the required configuration was set. This does not imply it is actually valid.
     */
    configured(state) {
      const config = state.config;
      return !!config.host && !!config.tenant && !!config.username && !!config.password;
    },
  },
  mutations: {
    setConfig(state, config: Config) {
      // TODO check/add trailing slashes?
      state.config = config;
    },

    // As committed by the local storage plugin, on page load and on any change from other windows
    loadFromStorage(state, config: Config) {
      state.config = config;
    },

    // As also watched by the local storage plugin
    persistInStorage(state, config: Config) {
      state.config = config;
    },
  },
  plugins: [localStoragePlugin],
});
