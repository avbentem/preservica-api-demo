<template>
  <div class="home intro">
    <h1>Preservica APIs demo</h1>
    <p>
      This is a (work in progress) kitchen sink showing various usage examples for some of the
      Preservica APIs as documented
      <a href="https://developers.preservica.com/api-reference">on their website</a> and in the
      Swagger UI interfaces
      <a href="https://eu.preservica.com/api/documentation.html">on your own instance</a>
      (adjust URL to match your Cloud Edition domain).
    </p>
    <p>
      This demo application runs in your browser, but for a typical use case the APIs would be
      accessed from a server application instead.
    </p>
    <AuthWarning />
    <p class="affiliation">
      Preservica&trade; is a trademark of <a href="https://preservica.com/">Preservica Ltd</a>. The
      creator of this application is not affiliated with that organisation.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AuthWarning from '@/components/AuthWarning.vue';

export default defineComponent({
  name: 'Home',
  components: { AuthWarning },
});
</script>

<style lang="scss" scoped="true">
.affiliation {
  font-size: 0.7rem;
  &,
  a {
    color: gray;
  }
}
</style>
