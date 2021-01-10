<template>
  <p v-if="!configured">
    You need to <router-link to="/config">configure this demo</router-link> to access your data.
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from '@/plugins/Auth';

export default defineComponent({
  setup() {
    const { configured } = useAuth();
    return { configured };
  },
});
</script>
