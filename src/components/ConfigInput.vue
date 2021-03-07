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
        <InputText
          id="password"
          type="password"
          v-model="config.password"
          aria-describedby="password-help"
        />
        <small id="password-help"> If saved, this is not encrypted </small>
      </div>
    </div>

    <Button
      icon="pi pi-save"
      @click="save"
      label="Save"
      v-tooltip.top="
        'Save the configuration, including your non-encrypted password, in all your browser windows that run this app (and use that to log in when needed)'
      "
    />
    &nbsp;
    <Button
      icon="pi pi-user"
      @click="login"
      label="Log in"
      v-tooltip.top="'Do not save the configuration, but log in right now'"
    />
    &nbsp;
    <Button
      icon="pi pi-lock"
      @click="getToken"
      label="Get token"
      v-tooltip.top="
        'Show the current token, or refresh it using the current configuration if it expired'
      "
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import { isEqual } from 'lodash-es';
import { AppState, Config } from '@/store';
import { useAuth } from '@/plugins/Auth';

export default defineComponent({
  setup() {
    const toast = useToast();
    const store = useStore<AppState>();
    const auth = useAuth();
    const config = ref<Config>();

    // The form should not update the state directly, so watch for state changes and create a local
    // copy on changes. This includes the initial default values, loading from local storage on page
    // load, any commits to the store even if nothing changed, and changes persisted in local
    // storage in other browser windows. As we're using `<keep-alive>` in App.vue, this will also
    // work when this view is not currently active, but only if it has been active before...
    watchEffect(() => {
      // Only report and invalidate any current token when this is not the initial load, and is
      // different from what is currently in the form, so: if changed in another browser window
      if (config.value && !isEqual(config.value, store.state.config)) {
        toast.add({
          severity: 'warn',
          summary: 'Configuration was updated from another browser window',
          detail:
            'If you want to use different settings in multiple browser windows, then use different browsers, or do not use Save after making the changes.',
        });
        auth.clearAuth();
      }
      config.value = { ...store.state.config };
    });

    const save = async () => {
      auth.clearAuth();
      // This will trigger the watchEffect in all browser windows
      store.commit('persistInStorage', config.value);
      toast.add({
        severity: 'info',
        summary: 'Saved new configuration',
        detail: 'But did not yet log in using that new configuration',
        life: 3000,
      });
    };

    const login = async () => {
      toast.add({
        severity: 'info',
        summary: 'Logging in',
        detail: config.value?.username,
        life: 3000,
      });

      store.commit('setConfig', config.value);
      await auth.login();
    };

    const getToken = async () => {
      store.commit('setConfig', config.value);
      const t = await auth.getToken();
      toast.add({ severity: 'info', summary: 'Token', detail: t });
    };

    return { config, save, login, getToken };
  },
});
</script>
