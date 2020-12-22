/**
 * Authenticates on the Preservica Access Token API.
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

  public user = ref<AuthenticatedUser | undefined>(undefined);
  public configured = ref(false);
  public authorized = ref(false);

  setConfig(config: Config) {
    this.config = config;
    this.configured.value = true;
  }

  async login(config?: Config) {
    if (config) {
      this.setConfig(config);
    }

    this.authorized.value = false;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const c = this.config;
    const url = `${c?.proxy}${c?.host}api/accesstoken/login`;
    // TODO percent-encode
    const body = `username=${c?.username}&password=${c?.password}&tenant=${c?.tenant}&includeUserDetails=true`;
    const res = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    }).catch((reason) => {
      this.toast.add({severity: 'error', summary: `Failed to connect to server`, detail: reason});
      throw new Error('Failed to connect to Preservica server');
    });

    if (!res.ok) {
      this.toast.add({
        severity: 'error',
        summary: `${res.status}: ${res.statusText}`,
        detail: await res.text(),
      });
      console.log(res);
      throw new Error(res.statusText);
    }

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
    console.log(this.user.value);
    this.authorized.value = true;
  }

  async getToken(): Promise<string> {
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
  }
}
