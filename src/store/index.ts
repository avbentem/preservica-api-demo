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
      // This requires origin or x-requested-with header
      proxy: 'https://cors-anywhere.herokuapp.com/',
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
