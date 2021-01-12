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
// See https://github.com/primefaces/primevue/issues/813
import { useToast } from 'primevue/components/toast/useToast';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { AppState } from '@/store';

/**
 * The minimum remaining lifetime before a token is considered expired. The documented lifetime is
 * 15 minutes, so always be on the safe side to allow the current API call to succeed.
 */
const MIN_TTL_MS = 10 * 60 * 1000;

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
  private store = useStore<AppState>();
  private toast = useToast();

  user = ref<AuthenticatedUser | undefined>(undefined);

  /**
   * Indicate if some configuration was set. This does not imply it is actually valid.
   */
  configured = computed<boolean>(() => this.store.getters.configured);

  /**
   * The curl-alternative of the last executed API call. Any embedded token will not be refreshed,
   * so may no longer be valid at the time the curl command is copied.
   *
   * This is not at all the same as the browser's fetch call; many headers such as `Origin`,
   * `Referer`, `Accept-Encoding` and `Accept-Language` and  are not included, and curl will add
   * `Host`, `User-Agent` and `Content-Length`.
   */
  lastCurl = ref('');

  /**
   * Clear the current user details, forcing a new login.
   *
   * We could automate this by watching the store's state, but we'd still want to reset this when
   * commencing a login that may actually fail.
   */
  clearAuth = () => {
    this.user.value = undefined;
  };

  login = async () => {
    this.clearAuth();

    const config = this.store.state.config;
    // TODO percent-encode
    const body = `username=${config.username}&password=${config.password}&tenant=${config.tenant}&includeUserDetails=true`;
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

    this.toast.add({
      severity: 'success',
      summary: 'Got new token',
      detail: this.user.value.token,
      life: 2000,
    });
  };

  getToken = async (): Promise<string> => {
    if (!this.store.getters.configured) {
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
    const config = this.store.state.config;
    const fullTarget = config.host + path;
    if (config.proxy) {
      // Just append, without any encoding
      return `${config.proxy}${fullTarget}`;
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

    const request = new Request(this.fullUrl(path), {
      ...defaults,
      ...init,
      headers: {
        ...defaults.headers,
        ...init?.headers,
        // Leave out if not given; override even if already set
        ...(token ? { 'Preservica-Access-Token': token } : null),
      },
    });

    const headers: string[] = [];
    for (const [name, value] of request.headers.entries()) {
      headers.push(`-H '${name}: ${value}'`);
    }
    // As the request.body stream will be needed by fetch, just assume init.body will do
    const body = init?.body ? ` --data '${init?.body}'` : '';
    // As request.url will include the proxy, re-create the URL here
    this.lastCurl.value = `curl -v '${this.store.state.config.host + path}' -X ${
      request.method
    } ${headers.join(' ')}${body}`;

    const res = await fetch(request).catch((reason) => {
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
