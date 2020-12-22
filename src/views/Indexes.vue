<template>
  <div class="indexes">
    <h1>Indexed fields</h1>
    <p>
      The
      <a href="https://developers.preservica.com/api-reference/8-content-api">Content API</a> can
      return the indexed fields, which can be used for search facets.
    </p>
    <AuthWarning />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AuthWarning from '@/components/AuthWarning.vue';

export default defineComponent({
  components: {AuthWarning},
});
</script>
