/*
 * Copyright (C) 2021 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonos
 *
 * This file is part of Project Fonos
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
import {FonosService, ServiceOptions} from "@fonos/common";
import {AuthClient} from "../service/protos/auth_grpc_pb";
import AuthPB from "../service/protos/auth_pb";
import {promisifyAll} from "grpc-promise";
import grpc from "@grpc/grpc-js";
import {
  CreateTokenRequest,
  CreateTokenResponse,
  ValidateTokenRequest
} from "./types";

/**
 * @classdesc Use Fonos Auth, a capability of Fonos,
 * to validate and create short life tokens.
 *
 * @extends FonosService
 * @example
 *
 * const request = {
 *   accessKeyId: "603693c0afaa1a080000000e",
 *   roleName: "ROLE",
 * };
 *
 * auth.createToken(request)
 * .then(console.log)       // returns an object with the token
 * .catch(console.error);   // an error occurred
 */
export default class Auths extends FonosService {
  /**
   * Constructs a new Auth object.
   * @param {ServiceOptions} options - Options to indicate the objects endpoint
   * @see module:core:FonosService
   */
  constructor(options?: ServiceOptions) {
    super(AuthClient, options);
    super.init(grpc);
    promisifyAll(super.getService(), {metadata: super.getMeta()});
  }

  /**
   * Creates a short-life token. The client must have role allowed to create
   * tokens.
   *
   * @param {CreateTokenRequest} request - Request to create a new token
   * @param {string} request.accessKeyId - Path to the function
   * @param {string} request.roleName - Unique function name
   * @return {Promise<CreateTokenResponse>}
   * @example
   *
   * const Fonos = require("@fonos/sdk");
   * const auth = new Fonos.Auth();
   *
   * const request = {
   *   accessKeyId: "603693c0afaa1a080000000e",
   *   roleName: "ROLE",
   * };
   *
   * auth.createToken(request)
   *  .then(console.log)       // returns an object with the token
   *  .catch(console.error);   // an error occurred
   */
  async createToken(request: CreateTokenRequest): Promise<CreateTokenResponse> {
    const req = new AuthPB.CreateTokenRequest();
    req.setAccessKeyId(request.accessKeyId);
    req.setRoleName(request.roleName);
    const res = await super.getService().createToken().sendMessage(req);
    return {
      token: res.getToken()
    };
  }

  /**
   * Creates a short-life token meant only to serve as a signature. This token will
   * only be useful to sign a request.
   *
   * @param {CreateTokenRequest} request - Request to create a new signature token
   * @param {string} request.accessKeyId - Path to the function
   * @return {Promise<CreateTokenResponse>}
   * @example
   *
   * const Fonos = require("@fonos/sdk");
   * const auth = new Fonos.Auth();
   *
   * const request = {
   *   accessKeyId: "603693c0afaa1a080000000e",
   * };
   *
   * auth.createNoAccessToken(request)
   *  .then(console.log)       // returns an object with the token
   *  .catch(console.error);   // an error occurred
   */
  async createNoAccessToken(
    request: CreateTokenRequest
  ): Promise<CreateTokenResponse> {
    const req = new AuthPB.CreateTokenRequest();
    req.setAccessKeyId(request.accessKeyId);
    const res = await super.getService().createNoAccessToken().sendMessage(req);
    return {
      token: res.getToken()
    };
  }

  /**
   * Checks if a give token was issue by the system.
   *
   * @param {CreateTokValidateTokenRequestenRequest} request - Request to verify the validity of a token
   * @param {string} request.token - Path to the function.
   * @return {Promise<boolean>}
   * @example
   *
   * const Fonos = require("@fonos/sdk");
   * const auth = new Fonos.Auth();
   *
   * const request = {
   *   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   * };
   *
   * auth.validateToken(request)
   *  .then(console.log)       // returns `true` or `false`
   *  .catch(console.error);   // an error occurred
   */
  async validateToken(request: ValidateTokenRequest): Promise<boolean> {
    const req = new AuthPB.ValidateTokenRequest();
    req.setToken(request.token);
    const res = await super.getService().validateToken().sendMessage(req);
    return res.getValid();
  }
}

export {AuthPB};

// WARNING: Workaround for support to commonjs clients
module.exports = Auths;
module.exports.AuthPB = AuthPB;
