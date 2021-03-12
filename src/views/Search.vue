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
        <IndexedFieldsTable :fields="indexedFields" v-model:selection="selectedFields" />
      </TabPanel>

      <TabPanel header="Request">
        <div class="intro p-mb-6">
          <p>
            This is the request that will be sent to the API, along with the values for
            <code>start</code>, <code>max</code> and the optional <code>parenthierarchy</code> and
            <code>id</code> for some API types.
          </p>
          <p>
            You can edit this manually, but it will also be updated when making changes in the other
            tabs and input fields. Making changes on the Metadata tab will override both
            <code>metadata</code> and <code>query.fields</code>.
          </p>
        </div>
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
  <div v-if="configured" class="p-mt-2 p-mx-lg-6 p-mx-md-2 p-mx-sm-0">
    <div class="p-fluid p-formgrid p-grid p-text-left">
      <div class="p-field p-col-12 p-lg-4 p-md-6">
        <label for="searchType">API</label>
        <Dropdown
          id="searchType"
          v-model="searchType"
          :options="searchTypes"
          optionLabel="name"
          optionValue="code"
          placeholder="Select an API"
        />
      </div>
      <div v-if="searchType === 'search-within'" class="p-field p-col-12 p-lg-8 p-md-6">
        <label for="parent-hierarchy">Parent hierarchy (GUID of folder to search within)</label>
        <InputText
          id="parent-hierarchy"
          v-model="searchParent"
          placeholder="e.g. 74b6bd3a-a294-499f-80aa-433826718013"
          :class="searchParentClass"
        />
        <small v-if="/.*\|/.test(searchParent)"
          >This looks like a CMIS id; you may want to
          <a href="javascript:undefined" @click="searchParent = searchParent.split('|')[1]"
            >remove the prefix <code>{{ /.*\|/.exec(searchParent)[0] }}</code></a
          >
        </small>
      </div>
      <div v-if="searchType === 'object-children'" class="p-field p-col-12 p-lg-8 p-md-6">
        <!-- TODO this also allows for `includevirtual` -->
        <label for="cmis-id"
          >CMIS id, starting with <code>sdb:SO|</code> or <code>sdb:IO|</code></label
        >
        <InputText
          id="cmis-id"
          v-model="searchParent"
          placeholder="e.g. sdb:IO|74b6bd3a-a294-499f-80aa-433826718013"
          :class="searchParentClass"
        />
        <small v-if="searchParent && searchParent.length > 7 && !/.*\|/.test(searchParent)"
          >This does not look like a CMIS id; you may want to
          <a href="javascript:undefined" @click="searchParent = 'sdb:SO|' + searchParent"
            >add the prefix <code>sdb:SO|</code></a
          >
        </small>
      </div>
    </div>

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
      <div class="p-field p-col-12 p-lg-6 p-md-6">
        <label for="q"
          >Search text
          <Tag v-if="searchType === 'top-level-list'" severity="warning"
            >not used for top-level list</Tag
          ></label
        >
        <InputText id="q" v-model="q" aria-describedby="q-help" />
        <small id="q-help"
          >Search is case-insensitive, supports wildcards <code>*</code> and <code>?</code>, and
          uppercase operators <code>AND</code> (default), <code>OR</code> and <code>NOT</code>. When
          not using wildcards then a hyphen <code>-</code> indicates the end of a word. Enclose
          words in double-quotes for exact phrases.
          <a
            href="https://usergroup.preservica.com/documentation/ce/6.2.1/userdocumentation/SystemUserGuide/ch08.html"
            >More info</a
          >.</small
        >
      </div>
      <div class="p-field p-col-6 p-lg-2 p-md-2">
        <label for="start">Start</label>
        <InputNumber
          id="start"
          v-model="start"
          :min="0"
          :step="max || 1"
          showButtons
          locale="en-US"
        />
      </div>
      <div class="p-field p-col-6 p-lg-2 p-md-2">
        <label for="max">Max</label>
        <InputNumber id="max" v-model="max" :min="0" showButtons locale="en-US" />
      </div>
      <div class="p-field p-col-12 p-lg-2 p-md-2">
        <label for="button">&nbsp;</label>
        <Button id="button" icon="pi pi-search" @click="runSearch" label="Search" />
      </div>
    </div>
  </div>

  <div v-if="result">
    <h2 v-if="!result.objectIds?.length">
      No results{{ result.totalHits > 0 ? ` for start = ${start.toLocaleString('en')}` : '' }}
    </h2>
    <h2 v-else>
      Results {{ (resultStart + 1).toLocaleString('en') }}&ndash;{{
        (resultStart + result.objectIds?.length).toLocaleString('en')
      }}
      of {{ result.totalHits.toLocaleString('en') }}
    </h2>
    <Paginator
      :first="resultStart"
      :rows="resultMax"
      :totalRecords="result.totalHits"
      @page="onPaginatorChange($event)"
    ></Paginator>
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
              <Thumbnail :object-id="slotProps.data._meta.objectId" />
            </template>
          </Column>

          <Column
            header="Highlight"
            headerClass="p-text-center"
            bodyClass="p-text-center highlight"
          >
            <template #body="slotProps">
              <!-- TODO is an array -->
              <div v-html="slotProps.data._meta.highlighting" />
            </template>
          </Column>

          <Column
            v-for="col of tableColumns"
            :field="col.field"
            :header="col.header"
            :key="col.field"
          >
            <template #body="slotProps">
              {{ slotProps.data[col.field + '.display'] || slotProps.data[col.field] }}
            </template>
          </Column>

          <template #expansion="slotProps">
            <div class="p-mb-2">
              <DownloadButton :object-id="slotProps.data._meta.objectId" />
              <div class="p-d-flex">
                <p>{{ slotProps.data._meta.objectId }}</p>
                <Button
                  v-if="isFolder(slotProps.data)"
                  label="search within all descendants"
                  class="p-button-link"
                  v-tooltip.top="'Search within all descendants of this structural object'"
                  @click="searchWithin(slotProps.data._meta.objectId)"
                />
                <Button
                  v-if="isFolder(slotProps.data)"
                  label="search in direct children"
                  class="p-button-link"
                  v-tooltip.top="'Search in direct children of this structural object'"
                  @click="objectChildren(slotProps.data._meta.objectId)"
                />
              </div>
            </div>
            <DocumentRenderer
              v-if="!isFolder(slotProps.data)"
              :object-id="slotProps.data._meta.objectId"
            />
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
import { PageState } from 'primevue/paginator';
import { useToast } from 'primevue/usetoast';
import AuthWarning from '@/components/AuthWarning.vue';
import DocumentRenderer from '@/components/DocumentRenderer.vue';
import DownloadButton from '@/components/DownloadButton.vue';
import IndexedFieldsTable from '@/components/IndexedFieldsTable.vue';
import Thumbnail from '@/components/Thumbnail.vue';
import { useAuth } from '@/plugins/Auth';
import {
  cmisRegex,
  FieldValues,
  guidRegex,
  IndexedField,
  ResultMetadata,
  searchTypes,
  useContentService,
} from '@/services/ContentService';
import { formatTimestamp } from '@/utils/formatters';

interface TableRow {
  _meta?: {
    objectId: string;
    highlighting: string[];
  };
  [index: string]: unknown;
}

interface TableColumn {
  field: string;
  header: string;
}

export default defineComponent({
  components: { IndexedFieldsTable, AuthWarning, DocumentRenderer, DownloadButton, Thumbnail },
  setup() {
    const toast = useToast();
    const { configured } = useAuth();
    const {
      getIndexedFields,
      searchType,
      searchParent,
      query,
      indexedFields,
      indexedFieldsLookup,
      metadata,
      start,
      max,
      search,
      result,
    } = useContentService();

    const selectedFields = ref<IndexedField[] | undefined>([]);
    const tableColumns = ref<TableColumn[]>([]);
    const tableExpandedRows = ref([]);
    const resultStart = ref(0);
    const resultMax = ref(0);

    const runSearch = async () => {
      // TODO add some loading indicator/button spinner
      tableExpandedRows.value = [];
      search();
      // Ensure changes in the metadata do not affect the search results currently displayed
      tableColumns.value = metadata.value?.split(',').map((col) => ({
        field: col,
        header: indexedFieldsLookup.value?.[col]?.displayName || col,
      }));
      resultStart.value = start.value;
      resultMax.value = max.value;
    };

    const onPaginatorChange = (event: PageState) => {
      start.value = event.page * max.value;
      runSearch();
    };

    const isFolder = (item: TableRow): boolean => {
      return item._meta?.objectId.startsWith('sdb:SO|') ?? false;
    };

    // TODO (re-)load once (re-)configured
    if (configured.value) {
      getIndexedFields();
    }

    return {
      configured,
      toast,
      indexedFields,
      indexedFieldsLookup,
      selectedFields,
      query,
      start,
      max,
      metadata,
      searchType,
      searchTypes,
      searchParent,
      runSearch,
      onPaginatorChange,
      result,
      resultStart,
      resultMax,
      tableColumns,
      tableExpandedRows,
      isFolder,
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
      if (!this.indexedFields || !this.query) {
        // In case tabs are changed before the list of fields has been fetched
        return;
      }
      const newSelectedFields = [];
      for (const field of this.query.fields) {
        // After manually making changes in the JSON text area, we may not find a match
        const f = this.indexedFieldsLookup?.[field.name];
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
      return this.indexedFieldsLookup?.[field.name]?.displayName || field.name;
    },
    addFilter(field: FieldValues) {
      field.values?.push('');
    },
    removeFilter(field: FieldValues, index: number) {
      field.values?.splice(index, 1);
    },
    searchWithin(objectId: string) {
      this.searchType = 'search-within';
      // Needs just the reference; strip the `sdb:SO|` prefix
      this.searchParent = objectId.split('|')[1];
      this.start = 0;
      // TODO we may want to support some navigation/routing to support going back
      this.runSearch();
    },
    objectChildren(objectId: string) {
      this.searchType = 'object-children';
      // Needs the full CMIS id, starting with `sdb:SO|`
      this.searchParent = objectId;
      this.start = 0;
      this.runSearch();
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
     *   ],
     *   "highlighting": {
     *     "sdb:IO|748602d1-9e9f-4e08-a100-5dc5b076d3d2": [
     *       "text fragment(s) as HTML, with <em>matches</em> highlighted"
     *     ],
     *     ...
     *   ],
     * ]
     * ```
     *
     * ...to (guessing your local timezone for timestamps):
     *
     * ```json
     * [
     *   {
     *     "_meta": {
     *       objectId": "sdb:IO|748602d1-9e9f-4e08-a100-5dc5b076d3d2",
     *       "highlighting": ["text fragment(s) as HTML, with <em>matches</em> highlighted"]
     *     },
     *     "xip.created": 1615031390000,
     *     "xip.created.display": "2021-03-06 12:49",
     *     "xip.title": "some title",
     *     ...
     *   },
     *   ...
     * ]
     * ```
     */
    tableResults(): TableRow[] {
      if (!this.result) {
        return [];
      }
      const results = this.result;
      const rows = this.result.metadata.map((row: ResultMetadata[]) => {
        return row.reduce((acc: TableRow, curr: ResultMetadata) => {
          acc[curr.name] = curr.value;
          if (this.indexedFieldsLookup?.[curr.name]?.type?.indexOf('DATE') !== -1) {
            acc[curr.name + '.display'] = formatTimestamp(curr.value as number);
          }
          return acc;
        }, {});
      });
      return rows.map((row: TableRow, index: number) => {
        const objectId = results.objectIds[index];
        row._meta = {
          objectId: objectId,
          // This is an array
          highlighting: results.highlighting[objectId],
        };
        return row;
      });
    },
    searchParentClass(): string {
      if (this.searchType === 'search-within') {
        return this.searchParent && guidRegex.test(this.searchParent) ? '' : 'p-invalid';
      }
      if (this.searchType === 'object-children') {
        return this.searchParent && cmisRegex.test(this.searchParent) ? '' : 'p-invalid';
      }
      return '';
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

::v-deep(.highlight) {
  em {
    background-color: khaki;
  }
}

::v-deep(.p-tabview-nav) {
  justify-content: center;
}
</style>
