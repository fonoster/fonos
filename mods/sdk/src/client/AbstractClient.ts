/*
 * Copyright (C) 2024 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ContactType } from "@fonoster/types";
import { makeRpcRequest } from "./makeRpcRequest";
import {
  ApplicationsClient,
  CallsClient,
  FonosterClient,
  IdentityClient,
  SecretsClient
} from "./types";
import { AclsClient } from "./types/AclsClient";
import { AgentsClient } from "./types/AgentsClient";
import { CredentialsClient } from "./types/CredentialsClient";
import { DomainsClient } from "./types/DomainsClient";
import { NumbersClient } from "./types/NumbersClient";
import { TrunksClient } from "./types/TrunksClient";
import {
  ContactType as ContactTypePB,
  ExchangeApiKeyRequest as ExchangeApiKeyRequestPB,
  ExchangeCredentialsRequest as ExchangeCredentialsRequestPB,
  ExchangeCredentialsResponse as ExchangeCredentialsResponsePB,
  ExchangeOauth2CodeRequest as ExchangeOauth2CodeRequestPB,
  ExchangeOauth2CodeResponse as ExchangeOauth2CodeResponsePB,
  ExchangeRefreshTokenRequest as ExchangeRefreshTokenRequestPB,
  SendVerificationCodeRequest as SendVerificationCodeRequestPB,
  VerifyCodeRequest as VerifyCodeRequestPB
} from "../generated/node/identity_pb";

abstract class AbstractClient implements FonosterClient {
  protected accessKeyId: string;
  protected _accessToken: string;
  protected _refreshToken: string;
  protected identityClient: IdentityClient;

  constructor(config: { accessKeyId: string; identityClient: IdentityClient }) {
    this.accessKeyId = config.accessKeyId;
    this.identityClient = config.identityClient;
    this._accessToken = "";
    this._refreshToken = "";
  }

  async login(
    username: string,
    password: string,
    verificationCode?: string
  ): Promise<void> {
    const { refreshToken, accessToken } = await makeRpcRequest<
      ExchangeCredentialsRequestPB,
      ExchangeCredentialsResponsePB,
      { username: string; password: string; verificationCode?: string },
      { refreshToken: string; accessToken: string }
    >({
      method: this.identityClient.exchangeCredentials.bind(this.identityClient),
      requestPBObjectConstructor: ExchangeCredentialsRequestPB,
      metadata: {},
      request: {
        username,
        password,
        verificationCode
      }
    });

    this._refreshToken = refreshToken;
    this._accessToken = accessToken;
  }

  async loginWithRefreshToken(refreshToken: string): Promise<void> {
    const { accessToken, refreshToken: newRefreshToken } = await makeRpcRequest<
      ExchangeRefreshTokenRequestPB,
      ExchangeCredentialsResponsePB,
      { refreshToken: string },
      { accessToken: string; refreshToken: string }
    >({
      method: this.identityClient.exchangeRefreshToken.bind(
        this.identityClient
      ),
      requestPBObjectConstructor: ExchangeRefreshTokenRequestPB,
      metadata: {},
      request: {
        refreshToken
      }
    });

    this._refreshToken = newRefreshToken;
    this._accessToken = accessToken;
  }

  async loginWithApiKey(
    accessKeyId: string,
    accessKeySecret: string
  ): Promise<void> {
    const { refreshToken, accessToken } = await makeRpcRequest<
      ExchangeApiKeyRequestPB,
      ExchangeCredentialsResponsePB,
      { accessKeySecret: string; accessKeyId: string },
      { refreshToken: string; accessToken: string }
    >({
      method: this.identityClient.exchangeApiKey.bind(this.identityClient),
      requestPBObjectConstructor: ExchangeApiKeyRequestPB,
      metadata: {},
      request: {
        accessKeyId,
        accessKeySecret
      }
    });

    this._refreshToken = refreshToken;
    this._accessToken = accessToken;
  }

  async loginWithOauth2Code(
    provider: "GITHUB",
    username: string,
    code: string
  ): Promise<void> {
    const { refreshToken, accessToken } = await makeRpcRequest<
      ExchangeOauth2CodeRequestPB,
      ExchangeOauth2CodeResponsePB,
      { provider: "GITHUB"; username: string; code: string },
      { refreshToken: string; accessToken: string }
    >({
      method: this.identityClient.exchangeOauth2Code,
      requestPBObjectConstructor: ExchangeOauth2CodeRequestPB,
      metadata: {},
      request: {
        provider,
        username,
        code
      }
    });

    this._refreshToken = refreshToken;
    this._accessToken = accessToken;
  }

  async sendVerificationCode(
    contactType: ContactType,
    value: string
  ): Promise<void> {
    await makeRpcRequest<
      SendVerificationCodeRequestPB,
      null,
      { contactType: ContactType; value: string },
      never
    >({
      method: this.identityClient.sendVerificationCode.bind(
        this.identityClient
      ),
      requestPBObjectConstructor: SendVerificationCodeRequestPB,
      metadata: {},
      request: {
        contactType: contactType as ContactType,
        value
      },
      enumMapping: [["contactType", ContactTypePB]]
    });
  }

  async verifyCode(request: {
    username: string;
    contactType: ContactType;
    value: string;
    verificationCode: string;
  }): Promise<void> {
    await makeRpcRequest<
      VerifyCodeRequestPB,
      null,
      {
        username: string;
        contactType: ContactType;
        value: string;
        verificationCode: string;
      },
      never
    >({
      method: this.identityClient.verifyCode.bind(this.identityClient),
      requestPBObjectConstructor: VerifyCodeRequestPB,
      metadata: {},
      request,
      enumMapping: [["contactType", ContactTypePB]]
    });
  }

  async refreshToken(): Promise<void> {
    return await this.loginWithRefreshToken(this._refreshToken);
  }

  getAccessKeyId(): string {
    return this.accessKeyId;
  }

  getAccessToken(): string {
    return this._accessToken;
  }

  getRefreshToken(): string {
    return this._refreshToken;
  }

  abstract getMetadata(): unknown;
  abstract getApplicationsClient(): ApplicationsClient;
  abstract getIdentityClient(): IdentityClient;
  abstract getSecretsClient(): SecretsClient;
  abstract getAgentsClient(): AgentsClient;
  abstract getNumbersClient(): NumbersClient;
  abstract getCredentialsClient(): CredentialsClient;
  abstract getDomainsClient(): DomainsClient;
  abstract getTrunksClient(): TrunksClient;
  abstract getAclsClient(): AclsClient;
  abstract getCallsClient(): CallsClient;
}

export { AbstractClient };
