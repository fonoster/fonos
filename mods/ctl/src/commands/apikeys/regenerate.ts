/* eslint-disable import/no-unresolved */
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
import * as SDK from "@fonoster/sdk";
import { Args } from "@oclif/core";
import { AuthenticatedCommand } from "../../AuthenticatedCommand";

export default class Regenerate extends AuthenticatedCommand<
  typeof Regenerate
> {
  static override readonly description =
    "generate a new access key secret for an API key";
  static override readonly examples = ["<%= config.bin %> <%= command.id %>"];
  static override readonly args = {
    ref: Args.string({
      description: "the Application to update",
      required: true
    })
  };

  public async run(): Promise<void> {
    const { args } = await this.parse(Regenerate);
    const { ref } = args;

    const client = await this.createSdkClient();
    const apiKeys = new SDK.ApiKeys(client);
    const result = await apiKeys.regenerateApiKey(ref);

    this.log("Access Key created successfully!");
    this.log(`Access Key ID: ${result.accessKeyId}`);
    this.log(`Access Key Secret: ${result.accessKeySecret}`);
    this.log("");
    this.warn(
      "This is the only time the Access Key Secret will be shown.\nPlease copy it and store it securely!"
    );
  }
}
