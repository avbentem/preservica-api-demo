/**
 * Authenticate on the Preservica Access Token API and provide helpers for HTTP calls with an
 * authorization header and some default header values.
 *
 * All class methods use arrow function expressions to ensure `this` is preserved and destructuring
 * works, like:
 *
 * ```typescript
 * const {configured, fetchWithToken} = useAuth();
 * ```
 *
 * @see https://developers.preservica.com/api-reference/6-access-token-api
 */

// TODO Module not found: Error: [CaseSensitivePathsPlugin] `[..]/node_modules/primevue/useToast.js`
// does not match the corresponding path on disk `usetoast.js`.
import {useToast} from 'primevue/usetoast';
import {ref} from 'vue';
import {Config} from '@/store';

/**
 * The minimum remaining lifetime before a token is considered expired.
 */
const MIN_TTL_MS = 60 * 1000;

export interface AuthenticatedUser {
  // In the SaaS installation, user is really just the email address
  user: string;
  fullName: string;
  email: string;
  roles: string[];
  token: string;
  // This is named "refresh-token" in the Preservica API response
  refreshToken: string;
  validForMinutes: number;
  validFrom: number;
  validUntil: number;
}

export class AuthService {
  private toast = useToast();
  // TODO get from store
  private config?: Config;

  user = ref<AuthenticatedUser | undefined>(undefined);

  /**
   * Indicate if some configuration was set. This does not imply it is actually valid.
   */
  configured = ref(false);

  /**
   * Indicate if a successful authorization has occurred.
   */
  authorized = ref(false);

  setConfig = (config: Config) => {
    this.config = config;
    this.configured.value = true;
    this.authorized.value = false;
  };

  login = async (config?: Config) => {
    if (config) {
      this.setConfig(config);
    }

    this.authorized.value = false;

    const c = this.config;
    // TODO percent-encode
    const body = `username=${c?.username}&password=${c?.password}&tenant=${c?.tenant}&includeUserDetails=true`;
    const res = await this.fetchWithDefaults('api/accesstoken/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    const json = await res.json();

    this.user.value = {
      user: json.user,
      fullName: json.fullName,
      email: json.email,
      roles: json.roles,
      token: json.token,
      refreshToken: json['refresh-token'],
      validForMinutes: json.validFor,
      validFrom: Date.now(),
      validUntil: Date.now() + json.validFor * 60 * 1000,
    };

    this.authorized.value = true;

    this.toast.add({
      severity: 'success',
      summary: 'Got new token',
      detail: this.user.value.token,
      life: 2000,
    });
  };

  getToken = async (): Promise<string> => {
    if (!this.config) {
      this.toast.add({
        severity: 'error',
        summary: 'Not configured',
        detail: 'You need to set the configuration first',
      });
      throw 'No credentials set';
    }
    // TODO we could actually refresh asynchronously and return the old token if time permits?
    if (!this.user.value || this.user.value.validUntil - Date.now() < MIN_TTL_MS) {
      await this.login();
    }
    if (!this.user.value) {
      // Actually, login will already have thrown
      throw 'Failed to authenticate';
    }
    return this.user.value.token;
  };

  /**
   * Enhance the given fetch request with a `Preservica-Access-Token` header (refreshing the token
   * if needed), expanding the path to include the base host and optional CORS proxy server, and
   * reporting errors in a toast.
   *
   * @param path the path to fetch (a full RequestInfo is not supported here)
   * @param init as in regular invocation of fetch
   */
  fetchWithToken = async (path: string, init?: RequestInit): Promise<Response> => {
    const token = await this.getToken();
    return this.fetchWithDefaults(path, init, token);
  };

  private fullUrl = (path: string) => {
    const fullTarget = this.config?.host + path;
    if (this.config?.proxy) {
      // Just append, without any encoding
      return `${this.config?.proxy}${fullTarget}`;
    }
    return fullTarget;
  };

  private fetchWithDefaults = async (
    path: string,
    init?: RequestInit,
    token?: string
  ): Promise<Response> => {
    const defaults = {
      headers: {
        Accept: 'application/json',
      },
    };

    const res = await fetch(this.fullUrl(path), {
      ...defaults,
      ...init,
      headers: {
        ...defaults.headers,
        ...init?.headers,
        // Leave out if not given; override even if already set
        ...(token ? {'Preservica-Access-Token': token} : null),
      },
    }).catch((reason) => {
      // For security reasons, specifics about what went wrong with a CORS request are not available
      // to JavaScript code. All the code knows is that an error occurred. The only way to determine
      // what specifically went wrong is to look at the browser's console for details.
      this.toast.add({
        severity: 'error',
        summary: 'Failed to connect to proxy or server',
        detail: reason,
      });
      throw new Error('Failed to connect to proxy or Preservica server');
    });

    if (!res.ok) {
      this.toast.add({
        severity: 'error',
        // HTTP/2 connections do not support res.statusText
        // See also https://fetch.spec.whatwg.org/#concept-response-status-message
        summary: `Error ${res.status}`,
        detail: (await res.text()) || path,
        // Set some max lifetime, as very wide error messages may hide the toast's close button
        life: 30000,
      });
      console.error(res);
      throw new Error(res.statusText);
    }

    return res;
  };
}
