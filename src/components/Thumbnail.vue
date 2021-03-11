<template>
  <div class="thumbnail">
    <div v-if="renderUrl && !hasError">
      <img :id="objectId" :src="renderUrl" alt="thumbnail" />
    </div>
    <div v-else-if="hasError">
      <p>-</p>
    </div>
    <div v-else>
      <p><i class="pi pi-spin pi-spinner"></i></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '@/plugins/Auth';

export default defineComponent({
  props: {
    // An ID like `sdb:IO|748602d1-9e9f-4e08-a100-5dc5b076d3d2`
    objectId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { fetchWithToken } = useAuth();
    const renderUrl = ref<string | undefined>();
    const hasError = ref<boolean>(false);

    fetchWithToken(
      // One can also specify, e.g., `&size=large`
      `api/content/thumbnail?id=${encodeURIComponent(props.objectId)}`,
      {
        headers: {
          Accept: '*',
        },
      },
      [404]
    ).then(async (response) => {
      // If the thumbnail cannot be rendered then we get a 404 Not Found
      if (response.ok) {
        renderUrl.value = URL.createObjectURL(await response.blob());
      } else {
        hasError.value = true;
      }
    });

    return { renderUrl, hasError };
  },

  beforeUnmount() {
    if (this.renderUrl) {
      URL.revokeObjectURL(this.renderUrl);
    }
  },
});
</script>

<style lang="scss" scoped="true">
.thumbnail {
  width: 100px;
  img {
    height: 100px;
  }
}
</style>
