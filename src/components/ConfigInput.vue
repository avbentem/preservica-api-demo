<template>
  <div class="configinput">
    <h2>Server and credentials</h2>

    <div class="p-fluid p-formgrid p-grid p-text-left">
      <div class="p-field p-col-12">
        <label for="proxy">CORS proxy</label>
        <InputText id="proxy" type="text" v-model="config.proxy" aria-describedby="proxy-help" />
        <small id="proxy-help">
          This demo runs in your browser, but the Preservica APIs do not support
          <a href="https://developer.mozilla.org/docs/Web/HTTP/CORS">CORS</a>. A proxy server can
          add CORS headers to use a browser on a different domain. The full API URL will be appended
          without any encoding.
          <strong>A third-party proxy may log your credentials.</strong>
        </small>
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

    <Button
      icon="pi pi-save"
      @click="save"
      label="Save"
      v-tooltip.top="'Set the configuration, but do not log in yet'"
    />
    &nbsp;
    <Button
      icon="pi pi-user"
      @click="login"
      label="Log in"
      v-tooltip.top="'Set the configuration and log in'"
    />
    &nbsp;
    <Button
      icon="pi pi-lock"
      @click="getToken"
      label="Get token"
      v-tooltip.top="'Show the current token, or refresh if needed'"
    />
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