<template>
  <div class="home">
    <h1>Preservica APIs demo</h1>
    <p>
      This is a (work in progress) kitchen sink showing various usage examples for some of
      <a href="https://developers.preservica.com/api-reference">the Preservica APIs.</a>
    </p>
    <p>
      This application runs in your browser. As a start, you will need to
      <router-link to="/config">configure this demo</router-link>
      to access your data.
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Home',
});
</script>
