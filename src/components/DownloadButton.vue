<template>
  <Button
    v-if="canDownload"
    label="Download"
    icon="pi pi-download"
    class="p-button-secondary"
    @click="download"
  />
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
    const canDownload = ref(false);
    const path = `api/content/download?id=${encodeURIComponent(props.objectId)}`;

    // Structural objects (directories) but maybe also some informational objects (files) may not
    // support downloading. Make a HEAD request to tell:
    fetchWithToken(
      path,
      {
        method: 'HEAD',
        headers: {
          Accept: '*',
        },
      },
      [403, 404]
    ).then((res) => {
      canDownload.value = res.ok;
    });

    const download = async () => {
      const res = await fetchWithToken(path, {
        method: 'GET',
        headers: {
          Accept: '*',
        },
      });
      const blob = await res.blob();

      // Parse the Content-Disposition header to get the proposed filename. Preservica uses, for
      // example, `Content-Disposition: attachment; filename="original-file-name.docx"`. If the
      // content is fetched using CORS, then the (proxy) server should at least include the header
      // `Access-Control-Expose-Headers: Content-Disposition`.
      const header = res.headers.get('content-disposition');
      const filename =
        header?.match(/filename=['"]?([^'"]*)/i)?.[1] || `download-${new Date().toISOString()}.doc`;

      // Apparently Microsoft Edge and Internet Explorer don't allow using a blob object directly
      // on a link's href, but provide their own API.
      // TODO test with the Chrome-based Edge
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
        return;
      }

      // For other browsers, create a link to also allow for setting the proposed filename.
      const objectURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectURL;
      link.download = filename;
      link.click();

      // For Firefox apparently we need to delay revoking the ObjectURL a bit
      setTimeout(() => {
        URL.revokeObjectURL(objectURL);
      }, 250);
    };

    return { canDownload, download };
  },
});
</script>
