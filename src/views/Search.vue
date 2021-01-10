<template>
  <div class="search intro">
    <h1>Search</h1>
    <p>
      Search could be performed using either CMIS or the API, but to use facets
      <a href="https://developers.preservica.com/api-reference/8-content-api">the Content API</a> is
      used.
    </p>
    <AuthWarning />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AuthWarning from '@/components/AuthWarning.vue';

export default defineComponent({
  components: { AuthWarning },
  setup() {
    return {};
  },
});
</script>
