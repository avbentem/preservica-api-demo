<template>
  <div class="search">
    <h1>Search</h1>
    <TabView v-if="configured" @tab-change="onTabChange">
      <TabPanel header="Introduction">
        <p class="intro">
          Search could be performed using either CMIS or the API, but to use facets
          <a href="https://developers.preservica.com/api-reference/8-content-api"
            >the Content API</a
          >
          is used. The available fields and filters are retrieved from
          <router-link to="/indexes">the indexed fields</router-link>.
        </p>
      </TabPanel>

      <TabPanel header="Metadata">
        <p class="intro p-mb-6">
          Select the metadata to include in the results. The very same items will also be configured
          as filters, but you can manually overrule that in the Request tab.
        </p>
        <DataTable
          v-if="fields"
          :value="fields"
          v-model:selection="selectedFields"
          :autoLayout="true"
          responsiveLayout="scroll"
          sortMode="multiple"
          :multiSortMeta="multiSortMeta"
          :filters="filters"
          class="p-datatable-sm"
        >
          <template #header>
            <div class="p-d-flex p-jc-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="all-column search"
                  size="50"
                />
              </span>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

          <Column
            field="shortName"
            header="source"
            :sortable="true"
            headerClass="p-text-center"
            bodyClass="p-text-center"
          >
          </Column>

          <Column field="displayName" header="name" :sortable="true"> </Column>

          <Column field="shortKey" header="key" :sortable="true"> </Column>

          <Column field="type" header="type" :sortable="true"></Column>

          <Column field="facetable" header="facet" :sortable="true"> </Column>
        </DataTable>
      </TabPanel>

      <TabPanel header="Request">
        <p class="intro p-mb-6">
          This is the request that will be sent to the API. You can edit this manually, but it will
          also be updated when making changes in the other tabs and input fields. Making changes on
          the Metadata tab will override both <code>metadata</code> and <code>query.fields</code>.
        </p>
        <div>
          <div class="p-fluid p-formgrid p-grid p-text-left">
            <div class="p-field p-col-12">
              <label for="metadata">Metadata to return</label>
              <InputText id="metadata" type="text" v-model="metadata" />
            </div>
            <div class="p-field p-col-12">
              <label for="query">Query</label>
              <!-- TODO editor with JSON syntax check -->
              <Textarea
                id="query"
                v-model="queryJson"
                rows="20"
                :autoResize="false"
                spellcheck="false"
              />
            </div>
          </div>
        </div>
      </TabPanel>
    </TabView>
    <AuthWarning />
  </div>

  <!-- TODO form for browser auto-complete -->
  <div v-if="configured" class="p-mx-lg-6 p-mx-md-2 p-mx-sm-0">
    <br />
    <div class="p-fluid p-formgrid p-grid p-text-left">
      <div
        v-for="(field, c1) in filtersAndValues"
        v-bind:key="`field-${c1}`"
        class="p-field p-col-12 p-lg-4 p-md-6"
      >
        <label :for="`f-${c1}-0`">Filter for {{ filterName(field) }}</label>
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-primary p-button-text"
          @click="addFilter(field)"
        />
        <!-- TODO support for dates -->
        <div v-for="(filter, c2) in field.values" v-bind:key="`filter-${c1}-${c2}`">
          <span class="p-input-icon-right p-mb-2">
            <InputText :id="`f-${c1}-${c2}`" v-model="field.values[c2]" />
            <i class="pi pi-times remove-filter" @click="removeFilter(field, c2)" />
          </span>
        </div>
      </div>
    </div>
    <div class="p-fluid p-formgrid p-grid p-text-left">
      <div class="p-field p-col-12 p-lg-8 p-md-6">
        <label for="q">Search text</label>
        <InputText id="q" v-model="q" />
      </div>
      <div class="p-field p-col-6 p-lg-1 p-md-2">
        <label for="start">Start</label>
        <InputNumber id="start" v-model="start" :min="0" showButtons />
      </div>
      <div class="p-field p-col-6 p-lg-1 p-md-2">
        <label for="max">Limit</label>
        <InputNumber id="max" v-model="max" :min="0" showButtons />
      </div>
      <div class="p-field p-col-12 p-lg-2 p-md-2 p-as-end">
        <Button icon="pi pi-search" @click="search" label="Search" />
      </div>
    </div>
  </div>

  <div v-if="result">
    <!-- value is a property in the Preservica JSON; it does not refer to, e.g., value in Vue's Ref -->
    <h2>Showing {{ result.value.objectIds?.length }} of {{ result.value.totalHits }} results</h2>
    <Accordion :activeIndex="0">
      <AccordionTab header="Table">
        <DataTable
          :value="tableResults"
          :autoLayout="true"
          responsiveLayout="scroll"
          v-model:expandedRows="tableExpandedRows"
        >
          <Column :expander="true" headerStyle="width: 1rem" bodyStyle="padding: 0" />
          <Column
            header="Preview"
            headerClass="p-text-center"
            bodyClass="p-text-center"
            :style="{ width: '100px' }"
          >
            <template #body="slotProps">
              <Thumbnail :object-id="slotProps.data.objectId" />
            </template>
          </Column>

          <Column
            v-for="col of tableColumns"
            :field="col.field"
            :header="col.header"
            :key="col.field"
          >
            <template #body="slotProps">
              {{ slotProps.data[col.field] }}
            </template>
          </Column>

          <template #expansion="slotProps">
            <DocumentRenderer :object-id="slotProps.data.objectId" />
          </template>
        </DataTable>
      </AccordionTab>

      <AccordionTab header="JSON">
        <div class="json">{{ result }}</div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import AuthWarning from '@/components/AuthWarning.vue';
import DocumentRenderer from '@/components/DocumentRenderer.vue';
import Thumbnail from '@/components/Thumbnail.vue';
import { useAuth } from '@/plugins/Auth';
import { IndexedField } from '@/views/Indexes.vue';

interface FieldValues {
  name: string;
  values?: string[];
}

interface ResultMetadata {
  name: string;
  value: unknown;
}

interface TableRow {
  [index: string]: unknown;
}

interface TableColumn {
  field: string;
  header: string;
}

export default defineComponent({
  components: { AuthWarning, DocumentRenderer, Thumbnail },
  setup() {
    const { configured, fetchWithToken } = useAuth();
    const toast = useToast();
    const fields = ref<IndexedField[] | undefined>(undefined);
    const selectedFields = ref<IndexedField[] | undefined>([]);
    const shortNames = ref<string[]>([]);
    const types = ref<string[]>([]);
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const multiSortMeta = ref([
      // XIP on top
      { field: 'shortName', order: -1 },
      { field: 'displayName', order: 1 },
    ]);

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const result = ref<{ [index: string]: any } | undefined>(undefined);
    /* eslint-enable  @typescript-eslint/no-explicit-any */
    const tableColumns = ref<TableColumn[]>([]);
    const tableExpandedRows = ref([]);
    const start = ref(0);
    const max = ref(10);

    // https://usergroup.preservica.com/documentation/ce/6.2.1/html/GuideToUniversalAccess.html
    // Each date interval has three parameters.
    // - The Start and End of the range are the dates which bound the range, which must be entered
    //   as `YYYY-MM-DD`. You can also use the special value `*`, which means to the end of time,
    //   i.e. a `*` at the beginning of a range means that all entries with a value in this field
    //   before the end date will be included, and a `*` in the End field means that all entries
    //   with a value after the start date will be included.
    // - The Title field specifies the text that will be shown for the interval when a user performs
    //   a search. It is also possible to define adjacent date ranges by leaving the End field
    //   blank. In this case, the interval will use the start date of the next interval as its end
    //   date (or, if you leave End blank for the last interval, it will use `*` as its End). This
    //   allows you to create and modify adjacent date ranges without having to edit the endpoints
    //   twice. If you do this, the ranges which have been set to be adjacent must be in ascending
    //   date order.
    //
    // The example image at the URL above shows a different example that seems to make more sense,
    // though "title" is still weird in the API call:
    //
    //              * - 1999-12-31 Pre 2000
    //     2000-01-01 - 2009-12-32 2000-2010
    //     2010-01-01 - *          2010 on
    //
    // Any field which is indexed as a tokenised string will be suitable for filtering, including
    // the following fields from the xip schema:
    // - Title (title).
    // - Description (description)
    const query = ref({
      q: '',
      fields: [
        // Initialize with empty string to show the input field
        { name: 'xip.title', values: [''] },
        { name: 'xip.description', values: [''] },
        { name: 'xip.document_type', values: ['IO'] },
      ] as FieldValues[],
      sort: [{ sortFields: ['xip.created'], sortOrder: 'desc' }],
      facets: ['xip.created', 'xip.format_group_r_Display'],
      'facet.xip.created.range': [
        ['*', '', 'Pre 2015'],
        ['2015-01-01', '', '2015'],
        ['2016-01-01', '', '2016'],
        ['2017-01-01', '', '2017'],
        ['2018-01-01', '', '2018'],
        ['2019-01-01', '', '2019'],
        ['2020-01-01', '', '2020'],
        ['2021-01-01', '*', '2021 and later'],
      ],
    });

    const metadata = ref(query.value.fields.map((field) => field.name).join());

    const search = async () => {
      // TODO add some loading indicator/button spinner
      result.value = undefined;

      // TODO percent-encode and create some helper
      const body = `q=${JSON.stringify(query.value)}&start=${start.value}&max=${
        max.value
      }&metadata=${metadata.value}`;

      const res = await fetchWithToken('api/content/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });
      result.value = await res.json();

      // Ensure changes in the metadata do not affect the search results currently displayed
      tableColumns.value = metadata.value?.split(',').map((col) => ({
        field: col,
        header: fields.value?.find((f: IndexedField) => f.shortKey === col)?.displayName || col,
      }));
    };

    // TODO (re-)load once (re-)configured
    if (configured.value) {
      fetchWithToken('api/content/indexed-fields').then(async (res) => {
        // value is a property in the Preservica JSON; it does not refer to, e.g., value in Vue's Ref
        fields.value = (await res.json()).value;
        // shortNames.value = [...new Set(fields?.value?.value.map((v) => v.shortName))];
        // types.value = [...new Set(fields?.value?.value.map((v) => v.type))];
      });
    }

    return {
      configured,
      toast,
      fields,
      selectedFields,
      filters,
      multiSortMeta,
      shortNames,
      types,
      query,
      start,
      max,
      metadata,
      search,
      result,
      tableColumns,
      tableExpandedRows,
    };
  },

  watch: {
    selectedFields(selected: IndexedField[]) {
      this.query.fields = selected.map((field) => ({
        name: field.shortKey,
        values: this.query.fields.find((f) => f.name === field.shortKey)?.values || [],
      }));
      // Regardless if the items in `query.fields` and `metadata` were the same
      this.metadata = this.query.fields.map((field) => field.name).join();
    },
    query(value) {
      this.q = value.q;
    },
  },
  methods: {
    /**
     * Update other tabs when changing the view. This is only useful to process some parts of the
     * JSON version of the request, which is likely to be invalid while typing.
     */
    onTabChange(/* event: { originalEvent: Event; index: number } */) {
      if (!this.fields || !this.query) {
        // In case tabs are changed before the list of fields has been fetched
        return;
      }
      const newSelectedFields = [];
      for (const field of this.query.fields) {
        // After manually making changes in the JSON text area, we may not find a match
        const f = this.fields.find((f) => field.name === f.shortKey);
        if (!f) {
          this.toast.add({
            severity: 'error',
            summary: 'Invalid field',
            detail: `The field ${field.name} in the JSON is invalid and will be removed when making other changes`,
            life: 5000,
          });
          // Avoid changing selectedFields which would yield removal at this point
          return;
        }
        newSelectedFields.push(f);
      }
      // This will trigger the watcher
      this.selectedFields = newSelectedFields;
    },
    filterName(field: FieldValues): string {
      return this.fields?.find((f) => f.shortKey === field.name)?.displayName || field.name;
    },
    addFilter(field: FieldValues) {
      field.values?.push('');
    },
    removeFilter(field: FieldValues, index: number) {
      field.values?.splice(index, 1);
    },
  },
  computed: {
    queryJson: {
      get(): string {
        return JSON.stringify(this.query, null, 2);
      },
      set(value: string) {
        // TODO error handling, and  display validation state near text area
        this.query = JSON.parse(value);
      },
    },
    q: {
      get(): string {
        return this.query.q;
      },
      set(value: string) {
        this.query.q = value;
      },
    },
    filtersAndValues: {
      get(): FieldValues[] {
        return this.query.fields;
      },
      set(values: FieldValues[]) {
        this.query.fields = values;
      },
    },
    /**
     * Map a Preservica search result like:
     *
     * ```json
     * {
     *   "objectIds": [
     *     "sdb:IO|748602d1-9e9f-4e08-a100-5dc5b076d3d2",
     *     ...
     *   ],
     *   ...,
     *   "metadata": [
     *     [
     *       { "name": "xip.created", "value": 1615031390000 },
     *       { "name": "xip.title", "value": "some title" },
     *       ...
     *     ],
     *     [
     *       ...
     *     ],
     *     ...
     *   ]
     * ]
     * ```
     *
     * ...to:
     *
     * ```json
     * [
     *   {
     *     "objectId": "sdb:IO|748602d1-9e9f-4e08-a100-5dc5b076d3d2",
     *     "xip.created": 1615031390000,
     *     "xip.title": "some title",
     *     ...
     *   },
     *   ...
     * ]
     * ```
     */
    tableResults(): TableRow[] {
      const rows = this.result?.value.metadata.map((row: ResultMetadata[]) => {
        return row.reduce((acc: TableRow, curr: ResultMetadata) => {
          acc[curr.name] = curr.value;
          return acc;
        }, {});
      });
      return rows.map((row: TableRow, index: number) => {
        row['objectId'] = this.result?.value.objectIds[index];
        return row;
      });
    },
  },
});
</script>

<style lang="scss" scoped="true">
textarea {
  font-family: monospace;
}

.remove-filter {
  cursor: pointer;
}

::v-deep(.p-tabview-nav) {
  justify-content: center;
}
</style>
