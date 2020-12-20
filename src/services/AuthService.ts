/**
 * Authenticates on the Preservica Access Token API.
 *
 * @see https://developers.preservica.com/api-reference/6-access-token-api
 */

/**
 * The minimum remaining lifetime before a token is considered expired.
 */
const MIN_TTL_MS = 60 * 1000;
import {Config} from '@/store';

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
  // TODO get from store
  private config?: Config;
  public user?: AuthenticatedUser;

  setConfig(config: Config) {
    this.config = config;
  }

  async login(config?: Config) {
    if (config) {
      this.setConfig(config);
    }

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const c = this.config;
    const url = `${c?.proxy}${c?.host}/api/accesstoken/login`;
    // TODO percent-encode
    const body = `username=${c?.username}&password=${c?.password}&tenant=${c?.tenant}&includeUserDetails=true`;
    const res = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const json = await res.json();
    this.user = {
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
    console.log(this.user);
  }

  async getToken(): Promise<string> {
    if (!this.config) {
      throw 'No credentials set';
    }
    // TODO we could actually refresh asynchronously and return the old token if time permits?
    if (!this.user || this.user.validUntil - Date.now() < MIN_TTL_MS) {
      await this.login();
    }
    if (!this.user) {
      throw 'Failed to authenticate';
    }
    return this.user.token;
  }
}
