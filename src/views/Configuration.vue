<template>
  <div class="configuration intro">
    <h1>Configuration</h1>

    <ConfigInput />

    <h2 v-if="!configured">Please complete the form and hit "Save" or "Log in"</h2>
    <h2 v-if="user">Welcome, {{ user.fullName }} (on {{ user.tenant }})</h2>

    <p>
      The Preservica APIs needs authorization, even for anonymous access. Above you need to set
      credentials, which this demo will use whenever it needs a new "access token" on the other
      pages of this demo. This demo will also show when a new token is created, but in this demo you
      don't need to do anything with that yourself.
    </p>
    <p>
      When logged in to Preservica Cloud Edition, the session cookie
      <a href="https://eu.preservica.com/OAI-PMH/?verb=Identify">will be used</a> when accessing the
      APIs in a browser directly. But for most use cases, a successful login on
      <a href="https://developers.preservica.com/api-reference/6-access-token-api"
        >the Access Token API</a
      >
      is required and yields an access token and a refresh token. An access token is valid for 15
      minutes and can be used in an HTTP header. However, the refresh token is valid for the same
      short period as the access token (and can only be used once), so is only useful when
      continuously accessing the API. In this demo the refresh token is ignored, and instead a new
      login is performed whenever the access token has expired.
    </p>
    <p>
      An access token is also used for Preservica-provided thumbnails and embedded document viewer.
      However, if keeping that viewer open beyond the token's lifetime, then the viewer may prompt
      for credentials. (A sane browser should warn you that the credentials will not be sent to this
      demo application, but to the Preservica server that hosts the embedded viewer.)
    </p>
    <p>
      A token can also be generated through the externally authenticated acquisition API. This
      allows a trusted external application to acquire Preservica access rights without being
      authenticated by Preservica. See the documentation linked above. For Cloud Edition this is
      only available when using SAML in conjunction with Universal Access.
    </p>
    <p>
      Even though the Swagger UI interface for the Authentication API uses the wrong Content Type
      and throws a 400 Bad Request, a token created above can often (for a short time) be used when
      clicking the "Authorize" button in
      <a href="https://eu.preservica.com/api/documentation.html">the Swagger UI interfaces</a>
      for the other APIs (adjust URL to match your Cloud Edition domain).
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from '@/plugins/Auth';
import ConfigInput from '@/components/ConfigInput.vue';

export default defineComponent({
  setup() {
    const { configured, user } = useAuth();
    return { configured, user };
  },
  components: { ConfigInput },
});
</script>
