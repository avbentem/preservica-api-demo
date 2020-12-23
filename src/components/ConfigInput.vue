<template>
  <div class="configinput">
    <h2>Server and credentials</h2>

    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12">
        <label for="proxy">CORS proxy</label>
        <InputText id="proxy" type="text" v-model="config.proxy" />
      </div>
      <div class="p-field p-col-12">
        <label for="host">API host</label>
        <InputText id="host" type="text" v-model="config.host" />
      </div>

      <div class="p-field p-col-12 p-md-3">
        <label for="tenant">Tenant</label>
        <InputText id="tenant" type="text" v-model="config.tenant" />
      </div>
      <div class="p-field p-col-12 p-md-5">
        <label for="username">Username</label>
        <InputText id="username" type="text" v-model="config.username" />
      </div>
      <div class="p-field p-col-12 p-md-4">
        <label for="password">Password</label>
        <InputText id="password" type="password" v-model="config.password" />
      </div>
    </div>

    <Button icon="pi pi-save" @click="save" label="Save" />
    &nbsp;
    <Button icon="pi pi-user" @click="login" label="Log in" />
    &nbsp;
    <Button icon="pi pi-lock" @click="getToken" label="Get token" />
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useStore} from 'vuex';
import {useToast} from 'primevue/usetoast';
import {Config} from '@/store';
import {useAuth} from '@/plugins/Auth';

export default defineComponent({
  setup() {
    const toast = useToast();
    const store = useStore();
    const auth = useAuth();
    const config = ref<Config>(store.state.config);

    const save = async () => {
      auth.setConfig(config.value);
      toast.add({
        severity: 'info',
        summary: 'Saved config',
        detail: 'But not logging in yet',
        life: 3000,
      });
    };

    const login = async () => {
      toast.add({
        severity: 'info',
        summary: 'Logging in',
        detail: config.value.username,
        life: 3000,
      });
      await auth.login(config.value);
    };

    const getToken = async () => {
      const t = await auth.getToken();
      toast.add({severity: 'info', summary: 'Token', detail: t});
    };

    return {config, save, login, getToken};
  },
});
</script>
