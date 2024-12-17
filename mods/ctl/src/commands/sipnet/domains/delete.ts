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
import { AuthenticatedCommand } from "../../../AuthenticatedCommand";

export default class Delete extends AuthenticatedCommand<typeof Delete> {
  static override readonly description =
    "delete a Domain from the active Workspace";
  static override readonly examples = ["<%= config.bin %> <%= command.id %>"];
  static override readonly args = {
    ref: Args.string({
      description: "the Domain reference",
      required: true
    })
  };

  public async run(): Promise<void> {
    const { args } = await this.parse(Delete);
    const { ref } = args;
    const client = await this.createSdkClient();
    const domains = new SDK.Domains(client);
    await domains.deleteDomain(ref);
    this.log("Done!");
  }
}
