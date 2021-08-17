import "../../config";
import Providers from "@fonos/providers";
import Numbers from "@fonos/numbers";
import {CLIError} from "@oclif/errors";
import {Command} from "@oclif/command";
import {cli} from "cli-ux";
import {CommonPB} from "@fonos/numbers";
import {Provider} from "@fonos/providers/src/types";
const inquirer = require("inquirer");

export default class CreateCommand extends Command {
  static description = `creates a new number resource
  ...
  Creates a new Number in the SIP Proxy subsystem
  `;

  async run() {
    console.log("This utility will help you create a new Number");
    console.log("Press ^C at any time to quit.");

    const view: CommonPB.View = CommonPB.View.BASIC;
    try {
      const response = await new Providers().listProviders({
        pageSize: 25,
        pageToken: "1"
      });

      interface objProvider {
        name?: string;
        value?: string;
      }

      const providers = response.providers.map((p: Provider) => {
        const obj: objProvider = {};
        obj.name = p.name;
        obj.value = p.ref;
        return obj;
      });

      if (providers.length === 0) {
        throw new Error("you must create a provider before adding a number");
      }

      const answers: any = await inquirer.prompt([
        {
          name: "e164Number",
          message: "number in E.164 format (e.g. +16471234567)",
          type: "input"
        },
        {
          name: "providerRef",
          message: "service provider",
          type: "list",
          choices: providers
        },
        {
          name: "aorLink",
          message: "aor link",
          type: "input",
          default: null
        }
      ]);

      if (!answers.aorLink) {
        const webhookPrompt = await inquirer.prompt([
          {
            name: "webhook",
            message: "webhook",
            type: "input",
            default: null
          }
        ]);

        answers.ingressInfo = {};
        answers.ingressInfo.webhook = webhookPrompt.webhook;
      }

      const confirmPrompt = await inquirer.prompt([
        {
          name: "confirm",
          message: "ready?",
          type: "confirm"
        }
      ]);

      answers.confirm = confirmPrompt.confirm;

      if (!answers.confirm) {
        console.log("Aborted");
      } else {
        cli.action.start(`Creating number ${answers.e164Number}`);
        const numbers = new Numbers();
        const result = await numbers.createNumber(answers);
        await cli.wait(1000);
        cli.action.stop(result.ref);
      }
    } catch (e) {
      cli.action.stop();
      if (e.code === 9) {
        throw new CLIError("This Number already exist");
      } else {
        throw new CLIError(e);
      }
    }
  }
}
