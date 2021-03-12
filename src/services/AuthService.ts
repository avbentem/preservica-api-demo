/**
 * Authenticate on the Preservica Access Token API and provide helpers for HTTP calls with an
 * authorization header and some default header values.
 *
 * All class methods use arrow function expressions to ensure `this` is preserved and destructuring
 * works with {@link useAuth}, like:
 *
 * ```typescript
 * const {configured, fetchWithToken} = useAuth();
 * ```
 *
 * @see https://developers.preservica.com/api-reference/6-access-token-api
 */

import { useToast } from 'primevue/usetoast';
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

interface CurlCommand {
  timestamp: string;
  command: string;
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
   * The curl-alternatives of the last executed API calls. Any embedded token will not be refreshed,
   * so may no longer be valid at the time the curl command is copied.
   *
   * This is not at all the same as the browser's fetch call; many headers such as `Origin`,
   * `Referer`, `Accept-Encoding` and `Accept-Language` and  are not included, and curl will add
   * `Host`, `User-Agent` and `Content-Length`.
   */
  lastCurls = ref<CurlCommand[]>([]);

  /**
   * Clear the current user details, forcing a new login.
   *
   * We could automate this by watching the store's state, but we'd still want to reset this when
   * commencing a login that may actually fail.
   */
  clearAuth = (): void => {
    this.user.value = undefined;
  };

  login = async (): Promise<void> => {
    this.clearAuth();

    const config = this.store.state.config;
    const body = `username=${encodeURIComponent(config.username)}&password=${encodeURIComponent(
      config.password
    )}&tenant=${encodeURIComponent(config.tenant)}&includeUserDetails=true`;
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
    // TODO Maybe require some larger minimum remaining lifetime for the viewer?
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
   * @param acceptableErrorCodes optional list of HTTP codes to ignore, like 404
   */
  fetchWithToken = async (
    path: string,
    init?: RequestInit,
    acceptableErrorCodes: number[] = []
  ): Promise<Response> => {
    const token = await this.getToken();
    return this.fetchWithDefaults(path, init, token, acceptableErrorCodes);
  };

  /**
   * Return the given `path` with the placeholder `{token}` replaced with a valid token.
   *
   * @param path a relative path such as `Render/render/external?entity=IO&entityRef=...&token={token}`
   */
  pathWithToken = async (path: string): Promise<string> => {
    const token = await this.getToken();
    return path.replace('{token}', token);
  };

  fullUrl = (path: string, useProxy = true) => {
    const config = this.store.state.config;
    const fullTarget = path.startsWith('http') ? path : config.host + path;
    if (useProxy && config.proxy) {
      // Just append, without any encoding
      return `${config.proxy}${fullTarget}`;
    }
    return fullTarget;
  };

  /**
   * Make a HTTP request, expanding the `path` to use the configured API host and proxy.
   */
  fetchWithDefaults = async (
    path: string,
    init?: RequestInit,
    token?: string,
    acceptableErrorCodes: number[] = []
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

    // Keep at most 25 curl commands (including the newly added one)
    this.lastCurls.value = this.lastCurls.value.slice(0, 24);
    const headers: string[] = [];
    for (const [name, value] of request.headers.entries()) {
      headers.push(`-H '${name}: ${value}'`);
    }
    // As the request.body stream will be needed by fetch, just assume init.body will do and is text
    const body = init?.body
      ? ` --data '${(init.body as string).replace(/(password=)([^&]+)/, '$1SECRET')}'`
      : '';
    // As request.url will include the proxy, re-create the URL here
    this.lastCurls.value.unshift({
      timestamp: new Date().toISOString(),
      command: `curl -v '${this.fullUrl(path, false)}' -X ${request.method} ${headers.join(
        ' '
      )}${body}`,
    });

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

    if (!res.ok && !acceptableErrorCodes.includes(res.status)) {
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
