<template>
  <div class="search intro">
    <h1>Search</h1>
    <p>
      Search could be performed using either CMIS or the API, but to use facets
      <a href="https://developers.preservica.com/api-reference/8-content-api">the Content API</a> is
      used.
    </p>
    <AuthWarning />
  </div>

  <div v-if="configured">
    <div class="p-fluid p-formgrid p-grid p-text-left">
      <div class="p-field p-col-12">
        <label for="query">Query</label>
        <!-- TODO editor with JSON syntax check -->
        <Textarea id="query" v-model="query" rows="10" :autoResize="true" spellcheck="false" />
      </div>
      <div class="p-field p-col-6 p-lg-2 p-sm-6">
        <label for="start">Start</label>
        <InputText id="start" type="number" v-model="start" />
      </div>
      <div class="p-field p-col-6 p-lg-2 p-sm-6">
        <label for="max">Max results</label>
        <InputText id="max" type="number" v-model="max" />
      </div>
      <div class="p-field p-col-12 p-lg-8 p-md-12">
        <label for="metadata">Metadata</label>
        <InputText id="metadata" type="text" v-model="metadata" />
      </div>
    </div>
    <br />
    <Button icon="pi pi-play" @click="search" label="Search" />
  </div>

  <div v-if="json">
    <Accordion>
      <AccordionTab header="JSON">
        <div class="json">{{ json }}</div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AuthWarning from '@/components/AuthWarning.vue';
import { useAuth } from '@/plugins/Auth';

export default defineComponent({
  components: { AuthWarning },
  setup() {
    const { configured, fetchWithToken } = useAuth();
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const json = ref<{ [index: string]: any } | undefined>(undefined);
    /* eslint-enable  @typescript-eslint/no-explicit-any */
    const start = ref(0);
    const max = ref(10);
    const metadata = ref('');

    const query = ref(`{
  "q": "",
  "facets": [ "oai_dc.date" ],
  "facet.oai_dc.date.range": [
    ["*", "", "Pre November 2020"],
    ["2020-11-01", "", "Post November 2020"]
  ],
  "fields": [
    { "name": "xip.title", "values": [] },
    { "name": "xip.document_type", "values": [] }
  ],
  "sort": [
    { "sortFields": ["xip.document_type"], "sortOrder": "desc" }
  ]
}`);

    const search = async () => {
      // TODO add some loading indicator/button spinner
      json.value = undefined;

      // TODO percent-encode and create some helper
      const body = `q=${query.value}&start=${start.value}&max=${max.value}&metadata=${metadata.value}`;

      const res = await fetchWithToken('api/content/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });
      json.value = await res.json();
    };

    return { configured, query, start, max, metadata, search, json };
  },
});
</script>

<style lang="scss" scoped="true">
textarea {
  font-family: monospace;
}
</style>
