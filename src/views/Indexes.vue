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

  <div v-if="indexedFields">
    <Accordion :activeIndex="0">
      <AccordionTab header="Table">
        <IndexedFieldsTable :fields="indexedFields" />
      </AccordionTab>

      <AccordionTab header="JSON">
        <div class="json">{{ indexedFields }}</div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AuthWarning from '@/components/AuthWarning.vue';
import IndexedFieldsTable from '@/components/IndexedFieldsTable.vue';
import { useAuth } from '@/plugins/Auth';
import { IndexedField, useContentService } from '@/services/ContentService';
import { FilterMatchMode } from 'primevue/api';

export default defineComponent({
  components: { AuthWarning, IndexedFieldsTable },

  setup() {
    const { configured } = useAuth();
    const { getIndexedFields } = useContentService();

    const indexedFields = ref<IndexedField[] | undefined>(undefined);
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const multiSortMeta = ref([
      { field: 'shortName', order: 1 },
      { field: 'displayName', order: 1 },
    ]);

    const getFields = async () => {
      indexedFields.value = await getIndexedFields();
    };

    return { configured, indexedFields, filters, multiSortMeta, getFields };
  },
});
</script>
