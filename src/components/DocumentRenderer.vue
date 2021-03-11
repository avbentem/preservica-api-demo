<template>
  <div v-if="renderUrl && !error">
    <iframe :id="objectId" :src="renderUrl"></iframe>
    <a :href="renderUrl" target='"_blank'>open in new window</a>
  </div>
  <div v-else-if="error">
    <p v-if="error === 403">You do not have sufficient access rights to view this content.</p>
    <p v-else-if="error === 404">Cannot find the file to show.</p>
    <p v-else>Cannot show this file type.</p>
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
    const { fetchWithDefaults, fullUrl, pathWithToken } = useAuth();
    const renderUrl = ref<string | undefined>();
    const error = ref<number | undefined>();

    // An ID like `sdb:IO|748602d1-9e9f-4e08-a100-5dc5b076d3d2`
    const [entity, entityRef] = props.objectId.match(/^.+:(.+)\|(.+)$/)?.slice(1) || [];

    // If the document cannot be rendered then we get a 403 Forbidden (with the text "Not Found").
    // As the server also sets `access-control-allow-origin https://<tenant>.access.preservica.com`
    // we cannot interact with the iframe, and cannot tell if it loaded successfully. So: issue a
    // HEAD request using the proxy so we can catch the 403, and if successful then embed the iframe
    // with the non-proxied direct URL (both URLs including an access token).
    pathWithToken(
      // The placeholder `{token}` is replaced by pathWithToken
      `Render/render/external?entity=${entity}&entityRef=${entityRef}&token={token}`
    ).then(async (path) => {
      const resp = await fetchWithDefaults(
        path,
        {
          method: 'HEAD',
          headers: {
            // A browser will be more specific when fetching the iframe
            Accept: '*',
          },
        },
        undefined,
        [403, 404]
      );
      if (resp.ok) {
        renderUrl.value = fullUrl(path, false);
      } else {
        error.value = resp.status;
      }
    });

    return { renderUrl, error };
  },
});
</script>

<style lang="scss" scoped="true">
iframe {
  width: 100%;
  height: 50vh;
}
</style>
