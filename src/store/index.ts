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
      // TODO add placeholder for URL, rather than just appending the URL
      proxy: 'https://proxy.arjanvanbentem.nl/?url=',
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
