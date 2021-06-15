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
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import {FonosService} from "@fonos/common";
import Secrets from "../src/client/secrets";

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
const sandbox = sinon.createSandbox();

const response = {
  getName: () => "test"
};

describe("@Fonos/secrets/client", () => {
  afterEach(() => sandbox.restore());

  it.only("should create a secret", async () => {
    sandbox.stub(FonosService.prototype, "init").returns();
    sandbox.stub(FonosService.prototype, "getService").returns({
      createSecret: () => {
        return {
          sendMessage: () => Promise.resolve(response)
        };
      }
    });

    const secrets = new Secrets();
    const result = await secrets.createSecret({name: "test", secret: "test"});
    expect(result).to.have.property("name").to.be.equal("test");
  });

  it.only("should list all secrets", async () => {
    sandbox.stub(FonosService.prototype, "init").returns();
    sandbox.stub(FonosService.prototype, "getService").returns({
      createSecret: () => {
        return {
          sendMessage: () => Promise.resolve(response)
        };
      }
    });

    const secrets = new Secrets();
    const result = await secrets.createSecret({name: "test", secret: "test"});
    expect(result).to.have.property("name").to.be.equal("test");
  });

  it.only("should get a secret", async () => {
    sandbox.stub(FonosService.prototype, "init").returns();
    const stubFunc = sandbox
      .stub(FonosService.prototype, "getService")
      .returns({
        deleteSecret: () => {
          return {
            sendMessage: () => Promise.resolve(response)
          };
        }
      });

    const secret = new Secrets();
    const result = await secret.deleteSecret({name: response.getName()});
  });

  it.only("should delete a function", async () => {
    sandbox.stub(FonosService.prototype, "init").returns();
    const stubFunc = sandbox
      .stub(FonosService.prototype, "getService")
      .returns({
        deleteSecret: () => {
          return {
            sendMessage: () => Promise.resolve({})
          };
        }
      });

    const secret = new Secrets();
    const result = await secret.deleteSecret({name: response.getName()});

    expect(stubFunc).to.be.calledTwice;
    expect(result).to.be.an("undefined");
  });
});
