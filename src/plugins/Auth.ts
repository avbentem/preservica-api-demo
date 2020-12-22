/**
 * Provide global access to authorization state.
 */
import {inject, provide} from 'vue';
import {AuthService} from '@/services/AuthService';

const authSymbol = Symbol();

export function provideAuth() {
  provide(authSymbol, new AuthService());
}

export function useAuth(): AuthService {
  const auth = inject<AuthService>(authSymbol);
  if (!auth) {
    throw Error('plugins/Auth not provided');
  }
  return auth;
}
