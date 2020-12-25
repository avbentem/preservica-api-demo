import {createStore} from 'vuex';

export interface Config {
  proxy: string;
  host: string;
  username: string;
  password: string;
  tenant: string;
}

export default createStore({
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
    } as Config,
  },
  mutations: {
    setConfig(state, config: Config) {
      // TODO check/add trailing slashes?
      state.config = config;
    },
  },
  actions: {},
  modules: {},
});
