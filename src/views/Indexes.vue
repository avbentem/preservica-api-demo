<template>
  <div class="indexes intro p-mb-6">
    <h1>Indexed fields</h1>
    <p>
      The
      <a href="https://developers.preservica.com/api-reference/8-content-api">Content API</a> can
      return the indexed fields, which can be used for search facets.
    </p>
    <AuthWarning />

    <Button
      v-if="configured"
      icon="pi pi-cloud-download"
      @click="getFields"
      label="Get indexed fields"
    />
  </div>

  <div v-if="fields">
    <Accordion :activeIndex="0">
      <AccordionTab header="Table">
        <!-- value is a property in the Preservica JSON; it does not refer to, e.g., value in Vue's Ref -->
        <DataTable
          :value="fields.value"
          :autoLayout="true"
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

          <Column field="index" header="index" :sortable="true" filterMatchMode="contains">
            <template #filter>
              <InputText type="text" v-model="filters['index']" class="p-column-filter" />
            </template>
          </Column>

          <Column field="shortName" header="short name" :sortable="true" filterMatchMode="contains">
            <template #filter>
              <InputText type="text" v-model="filters['shortName']" class="p-column-filter" />
            </template>
          </Column>

          <Column
            field="displayName"
            header="display name"
            :sortable="true"
            filterMatchMode="contains"
          >
            <template #filter>
              <InputText type="text" v-model="filters['displayName']" class="p-column-filter" />
            </template>
          </Column>

          <Column field="type" header="type" :sortable="true" filterMatchMode="in">
            <template #filter>
              <MultiSelect v-model="filters['type']" :options="types" placeholder="All" />
            </template>
          </Column>

          <Column field="facetable" header="facet" :sortable="true" filterMatchMode="equals">
            <template #filter>
              <Dropdown
                v-model="filters['facetable']"
                :options="[true, false]"
                placeholder="All"
                :showClear="true"
              />
            </template>
          </Column>
        </DataTable>
      </AccordionTab>

      <AccordionTab header="JSON">
        <div class="json">{{ fields }}</div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AuthWarning from '@/components/AuthWarning.vue';
import { useAuth } from '@/plugins/Auth';

/**
 * API response for a single indexed field, like:
 *
 * ```json
 * {
 *   "shortName": "ToPX",
 *   "uri": "http://www.nationaalarchief.nl/ToPX/v2.3",
 *   "index": "actornaam",
 *   "displayName": "Naam actor",
 *   "type": "SINGLE_VALUED_STRING_DEFAULT",
 *   "facetable": true
 * }
 * ```
 */
export interface IndexedField {
  // Schema Short Name in a Custom Index Definition document
  shortName: string;
  uri: string;
  index: string;
  shortKey: string;
  displayName: string;
  type: string;
  facetable: boolean;
}

export interface IndexedFieldsResponse {
  success: boolean;
  version: number;
  value: IndexedField[];
}

export default defineComponent({
  components: { AuthWarning },

  setup() {
    const { configured, fetchWithToken } = useAuth();

    const fields = ref<IndexedFieldsResponse | undefined>(undefined);
    const shortNames = ref<string[]>([]);
    const types = ref<string[]>([]);
    const filters = ref({});
    const multiSortMeta = ref([
      { field: 'shortName', order: 1 },
      { field: 'displayName', order: 1 },
    ]);

    const getFields = async () => {
      const res = await fetchWithToken('api/content/indexed-fields');
      fields.value = await res.json();
      shortNames.value = [...new Set(fields?.value?.value.map((v) => v.shortName))];
      types.value = [...new Set(fields?.value?.value.map((v) => v.type))];
    };

    return { configured, fields, filters, multiSortMeta, shortNames, types, getFields };
  },
});
</script>
