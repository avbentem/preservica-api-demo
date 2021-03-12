<template>
  <DataTable
    v-if="fields"
    :value="fields"
    :selection="selection"
    @update:selection="setSelection($event)"
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
          <InputText v-model="filters['global'].value" placeholder="all-column search" size="50" />
        </span>
      </div>
    </template>

    <!-- TODO Somehow using v-if throws child.children is null -->
    <Column
      v-for="dummy of selection ? [1] : []"
      v-bind:key="dummy"
      selectionMode="multiple"
      headerStyle="width: 3rem"
    ></Column>

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
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { IndexedField } from '@/services/ContentService';

export default defineComponent({
  props: {
    fields: {
      type: Object as PropType<IndexedField[]>,
      required: false,
    },
    selection: {
      type: Object as PropType<IndexedField[]>,
      required: false,
    },
  },

  setup(props, { emit }) {
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const multiSortMeta = ref([
      // XIP on top
      { field: 'shortName', order: -1 },
      { field: 'displayName', order: 1 },
    ]);

    // shortNames.value = [...new Set(fields?.value?.value.map((v) => v.shortName))];
    // types.value = [...new Set(fields?.value?.value.map((v) => v.type))];

    const setSelection = (selection: IndexedField[]) => {
      // Avoid `ESLint: Unexpected mutation of "selection" prop.(vue/no-mutating-props)` when using
      // the shorthand `v-model:selection="selectedFields"`, or when changing the property in code
      // here. See also https://v3.vuejs.org/guide/component-basics.html#using-v-model-on-components
      emit('update:selection', selection);
    };

    return { filters, multiSortMeta, setSelection };
  },
});
</script>
