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
    <br />
    <br />

    <div class="p-formgroup-inline p-jc-center">
      <div class="p-field">
        <label for="metadataPrefix">Prefix</label>
        <InputText id="metadataPrefix" type="text" v-model="metadataPrefix" />
      </div>
      <div class="p-field">
        <label for="filterFrom">From</label>
        <InputText
          id="filterFrom"
          type="text"
          placeholder="yyyy-mm-ddThh:mm:ssZ"
          v-model="filterFrom"
        />
      </div>
      <div class="p-field">
        <label for="filterUntil">Until</label>
        <InputText
          id="filterUntil"
          type="text"
          placeholder="yyyy-mm-ddThh:mm:ssZ"
          v-model="filterUntil"
        />
      </div>
      <div class="p-field">
        <label for="filterResumptionToken">Resumption token</label>
        <InputText id="filterResumptionToken" type="text" v-model="filterResumptionToken" />
      </div>
    </div>

    <br />
    <Button icon="pi pi-play" @click="listIdentifiers" label="List identifiers" />
    &nbsp;
    <Button icon="pi pi-play" @click="listRecords" label="List records" />
  </div>

  <br />

  <div v-if="xml">
    <Accordion>
      <AccordionTab header="Table">
        <DataTable
          :value="list"
          sortMode="multiple"
          :multiSortMeta="multiSortMeta"
          :filters="filters"
        >
          <template #header>
            <div style="text-align: right">
              <i class="pi pi-search" style="margin: 4px 4px 0px 0px"></i>
              <InputText v-model="filters['global']" placeholder="all-column search" size="50" />
            </div>
          </template>
          <Column
            v-for="col of columns"
            :field="col.field"
            :header="col.header"
            :key="col.field"
            :sortable="true"
            filterMatchMode="contains"
          >
            <template #filter>
              <InputText type="text" v-model="filters[col.field]" class="p-column-filter" />
            </template>
          </Column>
        </DataTable>
      </AccordionTab>
      <AccordionTab header="XML (prettified)">
        <div class="xml">{{ xml }}</div>
      </AccordionTab>
      <AccordionTab header="JSON (derived)">
        <div class="json">{{ json }}</div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { parseStringPromise } from 'xml2js';
import format from 'xml-formatter';
import AuthWarning from '@/components/AuthWarning.vue';
import { useAuth } from '@/plugins/Auth';

export default defineComponent({
  components: { AuthWarning },

  setup() {
    const { configured, fetchWithToken } = useAuth();
    const toast = useToast();

    const xml = ref<string | undefined>(undefined);
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const json = ref<{ [index: string]: any } | undefined>(undefined);
    const list = ref<{ [index: string]: any }[] | undefined>(undefined);
    /* eslint-enable  @typescript-eslint/no-explicit-any */
    const columns = [
      ['header.identifier', 'ID'],
      ['header.datestamp', 'Date'],
      ['metadata.XIP.StructuralObject.Title', 'Title'],
      ['metadata.XIP.StructuralObject.Description', 'Description'],
      ['metadata.XIP.StructuralObject.SecurityTag', 'Security tag'],
    ].map((tuple) => ({ field: tuple[0], header: tuple[1] }));
    const filters = ref({});
    const multiSortMeta = ref([]);
    const metadataPrefix = ref('oai_dc');
    const filterFrom = ref<string | undefined>('2020-01-01T00:00:00Z');
    const filterUntil = ref<string | undefined>('2030-12-31T23:59:59Z');
    const filterResumptionToken = ref<string | undefined>(undefined);

    const getData = async (verb: string, params?: string) => {
      // TODO add some loading indicator/button spinner
      xml.value = undefined;
      json.value = undefined;

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

      json.value = await parseStringPromise(text, {
        explicitArray: false,
        ignoreAttrs: true,
      });

      // Conversion from XML to JavaScript may introduce an excessive attribute that is in fact an
      // array, like `header` for ListIdentifiers, `metadataFormat` for ListMetadataFormats, or
      // `record` for ListRecords. Also, it may include `resumptionToken` for long results (more
      // than 200 results). Here check if there's only one other attribute and if that's an array:
      const data = json.value?.['OAI-PMH']?.[verb];

      const keys = Object.keys(data).filter((key) => key !== 'resumptionToken');
      const child = data[keys[0]];
      list.value = keys.length === 1 && Array.isArray(child) ? child : [data];
      filterResumptionToken.value = data.resumptionToken;
      const hasMore = data.resumptionToken !== undefined;
      toast.add({
        severity: 'info',
        summary: verb,
        detail: `Fetched ${list.value.length} result${list.value.length === 1 ? '' : 's'}${
          hasMore ? ', and more available' : ''
        }`,
        life: 3000,
      });
    };

    const identify = async () => getData('Identify');
    const listMetadataFormats = async () => getData('ListMetadataFormats');

    const getFilterParams = () =>
      `metadataPrefix=${metadataPrefix.value}${
        filterFrom.value ? `&from=${filterFrom.value}` : ''
      }${filterUntil.value ? `&until=${filterUntil.value}` : ''}${
        filterResumptionToken.value ? `&resumptionToken=${filterResumptionToken.value}` : ''
      }`;
    const listIdentifiers = async () => getData('ListIdentifiers', getFilterParams());
    const listRecords = async () => getData('ListRecords', getFilterParams());

    return {
      configured,
      xml,
      json,
      list,
      columns,
      filters,
      metadataPrefix,
      filterFrom,
      filterUntil,
      filterResumptionToken,
      multiSortMeta,
      identify,
      listMetadataFormats,
      listIdentifiers,
      listRecords,
    };
  },
});
</script>
