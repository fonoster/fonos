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
import { Flags } from "@oclif/core";
import cliui from "cliui";
import { AuthenticatedCommand } from "../../../AuthenticatedCommand";
import moment from "moment";

export default class List extends AuthenticatedCommand<typeof List> {
  static override readonly description =
    "display all calls made in the active Workspace";
  static override readonly examples = ["<%= config.bin %> <%= command.id %>"];
  static override readonly flags = {
    "page-size": Flags.string({
      char: "s",
      description: "the number of items to show",
      default: "1000",
      required: false
    })
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(List);
    const client = await this.createSdkClient();
    const calls = new SDK.Calls(client);
    const response = await calls.listCalls({
      pageSize: parseInt(flags["page-size"])
    });

    const ui = cliui({ width: 100 });

    ui.div(
      { text: "CALL ID", padding: [0, 0, 0, 0], width: 25 },
      { text: "STARTED AT", padding: [0, 0, 0, 0], width: 25 },
      { text: "ENDED AT", padding: [0, 0, 0, 0], width: 25 },
      { text: "FROM", padding: [0, 0, 0, 0], width: 30 },
      { text: "TO", padding: [0, 0, 0, 0], width: 30 },
      { text: "DURATION", padding: [0, 0, 0, 0], width: 10 }
    );

    response.items.forEach((call) => {
      ui.div(
        { text: (call as any).callId, padding: [0, 0, 0, 0], width: 25 },
        {
          text: moment(call.startedAt).format("YYYY-MM-DD HH:mm:ss"),
          padding: [0, 0, 0, 0],
          width: 25
        },
        {
          text: moment(call.endedAt).format("YYYY-MM-DD HH:mm:ss"),
          padding: [0, 0, 0, 0],
          width: 25
        },
        { text: call.from, padding: [0, 0, 0, 0], width: 30 },
        { text: call.to, padding: [0, 0, 0, 0], width: 30 },
        { text: call.duration + "", padding: [0, 0, 0, 0], width: 10 }
      );
    });

    this.log(ui.toString());
  }
}
