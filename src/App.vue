<template>
  <div id="nav">
    <router-link to="/">home</router-link>
    |
    <router-link to="/config">configuration</router-link>
    |
    <router-link to="/indexes">indexed fields</router-link>
    |
    <router-link to="/search">search</router-link>
    |
    <router-link to="/oai-pmh">oai-pmh</router-link>
    |
    <router-link to="/curl">curl</router-link>
  </div>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <Toast />
</template>

<script lang="ts">
import { provideAuth } from '@/plugins/Auth';

export default {
  setup() {
    provideAuth();
  },
};
</script>

<style lang="scss">
code {
  font-size: 120%;
  border: 1px solid lightgray;
  background-color: #f5f3f3;
  padding: 0 2px;
}

#view {
}

.intro {
  margin: auto;
  max-width: 600px;
}

.json,
.xml {
  display: block;
  font-family: Monaco, 'lucida console', Consolas, monospace;
  font-size: 0.7em;
  overflow: scroll;
  text-align: left;
  unicode-bidi: embed;
  white-space: pre;
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

.p-toast {
  // Ensure we can always read the full error message and see/click the close button
  word-wrap: anywhere;
  width: auto;
  min-width: 25rem;
  max-width: 35rem;
}
</style>
