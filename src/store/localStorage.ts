import { Store } from 'vuex';

/**
 * A Vuex plugin to store state in the browser's local storage and to watch for changes made in
 * other browser windows.
 *
 * This commits to the mutation `loadFromStorage` on initialization and when detecting changes from
 * another window, and will watch for state commited to `persistInStorage`.
 */
export const localStoragePlugin = (store: Store<unknown>) => {
  const storageKey = 'preservica-api-demo-config';

  if (window.localStorage) {
    // Retrieve storage on initialization (hence: on page load)
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      store.commit('loadFromStorage', JSON.parse(stored));
    }

    // Subscribe to change made by other windows. (This won't work on the same page that is making
    // the changes — it is really a way for other pages on the domain using the storage to sync any
    // changes that are made.)
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === storageKey) {
        store.commit('loadFromStorage', event.newValue ? JSON.parse(event.newValue) : undefined);
      }
    });
  }

  store.subscribe((mutation) => {
    if (window.localStorage && mutation.type === 'persistInStorage') {
      // Boldly assume that the browser indeed allows the storage
      window.localStorage.setItem(storageKey, JSON.stringify(mutation.payload));
    }
  });
};
