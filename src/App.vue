<template>
  <div id="nav">
    <router-link to="/">home</router-link>
    |
    <router-link to="/config">configuration</router-link>
    |
    <router-link to="/indexes">indexed fields</router-link>
    |
    <router-link to="/search">search</router-link>
  </div>
  <router-view id="view" />
  <Toast />
</template>

<script lang="ts">
import {provideAuth} from '@/plugins/Auth';

export default {
  setup() {
    provideAuth();
  },
};
</script>

<style lang="scss">
#view {
  margin: auto;
  max-width: 600px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
