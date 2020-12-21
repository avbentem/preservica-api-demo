<template>
  <div class="configuration">
    <h1>Configuration</h1>

    <ConfigInput />

    <p>
      Due to the server's (lack of) CORS settings, the Preservica APIs cannot be used from a browser
      directly, so this needs a CORS proxy server.
    </p>
    <p>The Preservica APIs needs authorization, even for anonymous access.</p>
    <p>
      A successful login on
      <a href="https://developers.preservica.com/api-reference/6-access-token-api"
        >the Access Token API</a
      >
      yields an access token and a refresh token. A successful token is valid for 15 minutes.
      However, the refresh token is valid for the same short period as the access token (and can
      only be used once), so is only useful when continuously accessing the API. In this demo the
      refresh token is ignored, and instead a new login is performed whenever the access token has
      expired.
    </p>
    <p>
      A token can also be generated through the externally authenticated acquisition API. This
      allows a trusted external application to acquire Preservica access rights without being
      authenticated by Preservica. See the documentation linked above.
    </p>
    <p>
      <s
        >The resulting access token can also (for a short time) be used in
        <a href="https://eu.preservica.com/api/content/documentation.html"
          >the Swagger UI interface</a
        >
        (adjust URL to match your SaaS domain).</s
      >
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ConfigInput from '@/components/ConfigInput.vue';

export default defineComponent({
  components: {ConfigInput},
});
</script>
