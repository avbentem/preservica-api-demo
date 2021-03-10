<template>
  <div class="intro">
    <h1>curl</h1>
    <p v-if="lastCurls && lastCurls.length">
      The last API request can be executed <a href="https://curl.se/">using curl</a> as:
    </p>
    <p v-else>
      If any API request has been made, then this page will show the command to repeat the last
      request <a href="https://curl.se/">using curl</a>.
    </p>
  </div>
  <div>
    <p v-for="curl of lastCurls" v-bind:key="curl.timestamp">
      {{ curl.timestamp }}
      <br />
      <strong
        ><code>{{ curl.command }}</code></strong
      >
    </p>
  </div>
  <div class="intro">
    <p v-if="lastCurls && lastCurls.length">
      Note that this is not exactly the same as the request that this application makes through your
      browser. Any proxy server is ignored, and a browser includes additional headers such as
      <code>Origin</code>, <code>Referer</code>, <code>Accept-Encoding</code> and
      <code>Accept-Language</code>. Just like a browser, curl will add its own <code>Host</code>,
      <code>User-Agent</code> and <code>Content-Length</code>.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from '@/plugins/Auth';

export default defineComponent({
  name: 'Curl',
  setup() {
    const { lastCurls } = useAuth();
    return {
      lastCurls,
    };
  },
});
</script>
