<template>
  <div class="home intro">
    <h1>Preservica APIs demo</h1>
    <p>
      This is a (work in progress) kitchen sink showing various usage examples for some of
      <a href="https://developers.preservica.com/api-reference">the Preservica APIs.</a>
    </p>
    <p>This application runs in your browser.</p>
    <AuthWarning />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AuthWarning from '@/components/AuthWarning.vue';

export default defineComponent({
  name: 'Home',
  components: {AuthWarning},
});
</script>
