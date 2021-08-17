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
/* eslint-disable require-jsdoc */
import logger from "@fonos/logger";
import * as grpc from "@grpc/grpc-js";
import {
  HealthCheckRequest,
  HealthCheckResponse,
  HealthClient
} from "grpc-ts-health-check";

const host = process.env.SERVICE_ADDRESS || "localhost";
const port = parseInt(process.env.SERVICE_PORT) || 50052;
const service = process.env.SERVICE_NAME || "";

export default function (): void {
  const healthClient = new HealthClient(
    `${host}:${port}`,
    grpc.credentials.createInsecure()
  );
  const request = new HealthCheckRequest();
  request.setService(service);
  healthClient.check(
    request,
    (error: Error | null, response: HealthCheckResponse) => {
      if (error) {
        logger.error(`@fonos/common healthcheck fialed: ${error}`, error);
        process.exit(1);
      } else {
        logger.verbose(
          `@fonos/common healthcheck success [status: ${response.getStatus()}]`
        );
        process.exit(0);
      }
    }
  );
}
