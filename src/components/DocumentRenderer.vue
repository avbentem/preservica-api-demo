<template>
  <div v-if="renderUrl && !hasError">
    <iframe :id="objectId" :src="renderUrl"></iframe>
    <a :href="renderUrl" target='"_blank'>open in new window</a>
  </div>
  <div v-else-if="hasError">
    <p>Sorry, cannot show this file type.</p>
  </div>
  <div v-else>
    <p>Opening file...</p>
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
    const hasError = ref<boolean>(false);

    // An ID like `sdb:IO|748602d1-9e9f-4e08-a100-5dc5b076d3d2`
    const [entity, entityRef] = props.objectId.match(/^sdb:(.*)\|(.*)$/)?.slice(1) || [];

    // The placeholder `{token}` is replaced by fullUrlWithToken
    const path = `Render/render/external?entity=${entity}&entityRef=${entityRef}&token={token}`;

    // If the document cannot be rendered then we get a 403 Forbidden (with the text "Not Found").
    // As the server also sets `access-control-allow-origin https://<tenant>.access.preservica.com`
    // we cannot interact with the iframe, and cannot tell if it loaded successfully. So: issue a
    // HEAD request using the proxy so we can catch the 403, and if successful then embed the iframe
    // with the non-proxied direct URL (both URLs including an access token).
    fullUrlWithToken(path, true).then(async (url) => {
      const resp = await fetch(url, {
        method: 'HEAD',
      });
      if (resp.ok) {
        renderUrl.value = await fullUrlWithToken(path, false);
      } else {
        hasError.value = true;
      }
    });

    return { renderUrl, hasError };
  },
});
</script>

<style lang="scss" scoped="true">
iframe {
  width: 100%;
  height: 50vh;
}
</style>
