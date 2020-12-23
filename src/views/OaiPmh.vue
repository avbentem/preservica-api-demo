<template>
  <div class="oaipmh intro">
    <h1>OAI-PMH</h1>
    <p>
      Preservica provides
      <a href="https://developers.preservica.com/api-reference/oai-pmh-data-provider"
        >an OAI-PMH Data Provider implementation</a
      >
      for metadata harvesting. This can be used by an external system, such as a cataloging
      application, to retrieve information about the hierarchy of logical objects - structural
      objects (folders) and information objects (assets) - in the archive.
    </p>
    <p>
      Like for the other APIs an access token is needed. But for backward compatibility reasons, the
      OAI-PMH Data Provider also supports HTTP basic authentication, where a Preservica user name
      and password are encoded into an HTTP Authorization header. In this demo, tokens are used.
    </p>
    <AuthWarning />
  </div>

  <div v-if="configured">
    <Button icon="pi pi-cloud-download" @click="identify" label="Identify" />
    &nbsp;
    <Button
      icon="pi pi-cloud-download"
      @click="listMetadataFormats"
      label="List metadata formats"
    />
    &nbsp;
    <Button icon="pi pi-cloud-download" @click="listIdentifiers" label="List identifiers" />
    &nbsp;
    <Button icon="pi pi-cloud-download" @click="listRecords" label="List records" />
  </div>

  <br />

  <div v-if="xml">
    <Accordion :activeIndex="0">
      <AccordionTab header="XML (prettified)">
        <div class="xml">{{ xml }}</div>
      </AccordionTab>
      <AccordionTab header="JSON (generated)">
        <div class="json">{{ tree }}</div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {parseStringPromise} from 'xml2js';
import format from 'xml-formatter';
import AuthWarning from '@/components/AuthWarning.vue';
import {useAuth} from '@/plugins/Auth';

export default defineComponent({
  components: {AuthWarning},

  setup() {
    const {configured, fetchWithToken} = useAuth();

    const xml = ref<string | undefined>(undefined);
    const tree = ref<{} | undefined>(undefined);

    const getData = async (verb: string, params?: string) => {
      // TODO add some loading indicator/button spinner
      xml.value = undefined;
      tree.value = undefined;

      const path = `OAI-PMH/?verb=${verb}${params ? `&${params}` : ''}`;
      const res = await fetchWithToken(path, {
        headers: {
          // Override the default 'application/json' (even though Preservica doesn't seem to care)
          Accept: '*',
        },
      });
      const text = await res.text();

      // TODO lazy-load upon opening of accordion
      xml.value = format(text, {
        indentation: '  ',
        collapseContent: true,
        // Make it easier to copy the results
        lineSeparator: '\n',
      });

      tree.value = await parseStringPromise(text, {
        explicitArray: false,
        ignoreAttrs: true,
      });
    };

    const identify = async () => getData('Identify');
    const listMetadataFormats = async () => getData('ListMetadataFormats');
    const listIdentifiers = async () => getData('ListIdentifiers', 'metadataPrefix=XIP');
    const listRecords = async () => getData('ListRecords', 'metadataPrefix=XIP');

    return {configured, xml, tree, identify, listMetadataFormats, listIdentifiers, listRecords};
  },
});
</script>
