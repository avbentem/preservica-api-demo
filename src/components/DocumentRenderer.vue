<template>
  <div v-if="renderUrl">
    <iframe :src="renderUrl"></iframe>
    <a :href="renderUrl" target='"_blank'>open in new window</a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '@/plugins/Auth';

export default defineComponent({
  props: {
    objectId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { fullUrlWithToken } = useAuth();
    const renderUrl = ref<string | undefined>();

    // An ID like `sdb:IO|748602d1-9e9f-4e08-a100-5dc5b076d3d2`
    const [entity, entityRef] = props.objectId.match(/^sdb:(.*)\|(.*)$/)?.slice(1) || [];
    // The placeholder `{token}` is replaced by fullUrlWithToken
    fullUrlWithToken(
      `Render/render/external?entity=${entity}&entityRef=${entityRef}&token={token}`,
      false
    ).then((url) => (renderUrl.value = url));

    return { renderUrl };
  },
});
</script>

<style lang="scss" scoped="true">
iframe {
  width: 100%;
  height: 50vh;
}
</style>
