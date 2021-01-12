<template>
  <div class="configuration intro">
    <h1>Configuration</h1>

    <ConfigInput />

    <h2 v-if="!configured">Please complete the form and hit "Save" or "Log in"</h2>
    <h2 v-if="user">Welcome, {{ user.fullName }}</h2>

    <p>The Preservica APIs needs authorization, even for anonymous access.</p>
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
      A token can also be generated through the externally authenticated acquisition API. This
      allows a trusted external application to acquire Preservica access rights without being
      authenticated by Preservica. See the documentation linked above. For Cloud Edition this is
      only available when using SAML in conjunction with Universal Access.
    </p>
    <p>
      <s
        >The resulting access token can also (for a short time) be used in
        <a href="https://eu.preservica.com/api/content/documentation.html"
          >the Swagger UI interface</a
        >
        (adjust URL to match your Cloud Edition domain).</s
      >
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
