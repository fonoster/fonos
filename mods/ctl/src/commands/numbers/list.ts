import "../../config";
import Numbers from "@fonos/numbers";
import {CLIError} from "@oclif/errors";
import {Command, flags as oclifFlags} from "@oclif/command";
import inquirer from "inquirer";
import {CommonPB} from "@fonos/numbers";
import {cli} from "cli-ux";

export default class ListCommand extends Command {
  static description = `list registered numbers
  ...
  List the registered numbers
  `;

  static flags = {
    size: oclifFlags.integer({
      char: "s",
      default: 25,
      description: "number of result per page"
    })
  };

  static aliases = ["numbers:ls"];

  async run() {
    const {flags} = this.parse(ListCommand);
    try {
      const numbers = new Numbers();
      let firstBatch = true;
      let pageToken = "1";
      const pageSize = flags.size;
      const view: CommonPB.View = CommonPB.View.BASIC;
      while (true) {
        // Get a list
        const result: any = await numbers.listNumbers({
          pageSize,
          pageToken,
          view
        });
        const list = result.numbers;
        pageToken = result.nextPageToken;

        // Dont ask this if is the first time or empty data
        if (list.length > 0 && !firstBatch) {
          const answer: any = await inquirer.prompt([
            {name: "q", message: "More", type: "confirm"}
          ]);
          if (!answer.q) break;
        }

        if (list.length < 1) break;

        cli.table(list, {
          ref: {minWidth: 15},
          providerRef: {header: "Provider Ref", minWidth: 15},
          e164Number: {header: "E164 Number", minWidth: 15},
          aorLink: {
            header: "AOR Link",
            minWidth: 15,
            get: (row) => (row["aorLink"] ? row["aorLink"] : "--")
          },
          ingressInfo: {
            header: "Webhook",
            minWidth: 15,
            get: (row) =>
              row["ingressInfo"] ? row["ingressInfo"].webhook : "--"
          }
        });

        firstBatch = false;
        if (!pageToken) break;
      }
    } catch (e) {
      throw new CLIError(e.message);
    }
  }
}
