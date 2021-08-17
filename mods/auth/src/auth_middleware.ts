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
const grpc = require("@grpc/grpc-js");
import Auth from "./utils/auth_utils";
import JWT from "./utils/jwt";
import roleHasAccess from "./utils/role_has_access";
import logger from "@fonos/logger";

const WHITELIST = process.env.AUTH_ACCESS_WHITELIST
  ? process.env.AUTH_ACCESS_WHITELIST.split(",")
  : [];

export default class AuthMiddleware {
  privateKey: string;
  whitelist: string[];

  constructor(privateKey: string, whitelist = []) {
    this.privateKey = privateKey;
    this.whitelist = whitelist || WHITELIST;
  }

  middleware = async (ctx: any, next: any, errorCb: any) => {
    const pathRequest = ctx.service.path;

    logger.verbose(`@fonos/logger middleware [request.path = ${pathRequest}]`);

    if (this.whitelist.includes(pathRequest)) {
      next();
      return;
    }

    const jwtHandler = new Auth(new JWT());
    console.log(ctx.call.metadata.get("access_key_id").toString());

    try {
      if (
        !ctx.call.metadata.get("access_key_id").toString() ||
        !ctx.call.metadata.get("access_key_secret").toString()
      ) {
        errorCb({
          code: grpc.status.UNAUTHENTICATED,
          message: "UNAUTHENTICATED"
        });
        return;
      }

      const accessKeyId = ctx.call.metadata.get("access_key_id").toString();
      const accessKeySecret = ctx.call.metadata
        .get("access_key_secret")
        .toString();

      jwtHandler
        .validateToken({accessToken: accessKeySecret}, this.privateKey)
        .then(async (result) => {
          if (result.isValid) {
            if (result.data.accessKeyId != accessKeyId)
              errorCb({
                code: grpc.status.UNAUTHENTICATED,
                // TODO: Improve error message
                message: "UNAUTHENTICATED"
              });

            const hasAccess = await roleHasAccess(
              result.data.role,
              pathRequest
            );

            if (hasAccess) {
              await next();
            } else {
              errorCb({
                code: grpc.status.PERMISSION_DENIED,
                // TODO: Improve error message
                message: "PERMISSION_DENIED"
              });
            }
          } else {
            errorCb({
              code: grpc.status.UNAUTHENTICATED,
              // TODO: Improve error message
              message: "UNAUTHENTICATED"
            });
          }
        });
    } catch (e) {
      errorCb({
        code: grpc.status.INTERNAL,
        message: e
      });
    }
  };
}
