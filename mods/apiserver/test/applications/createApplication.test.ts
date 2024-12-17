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
import { ApplicationType } from "@fonoster/types";
import * as grpc from "@grpc/grpc-js";
import * as chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { createSandbox } from "sinon";
import sinonChai from "sinon-chai";
import { Prisma } from "../../src/core/db";
import { TEST_TOKEN } from "../utils";

chai.use(chaiAsPromised);
chai.use(sinonChai);
const sandbox = createSandbox();

describe("@applications/createApplication", function () {
  afterEach(function () {
    return sandbox.restore();
  });

  it("should create an application", async function () {
    // Arrange
    const { createApplication } = await import(
      "../../src/applications/createApplication"
    );
    const metadata = new grpc.Metadata();
    metadata.set("token", TEST_TOKEN);

    const applications = {
      application: {
        create: sandbox.stub().resolves({ ref: "123" })
      }
    } as unknown as Prisma;

    const call = {
      metadata,
      request: {
        name: "My Application",
        type: ApplicationType.EXTERNAL,
        endpoint: "localhost:50061"
      }
    };

    const callback = sandbox.stub();

    // Act
    await createApplication(applications)(call, callback);

    // Assert
    expect(callback).to.have.been.calledOnceWithExactly(null, { ref: "123" });
  });

  it("should throw an error if the application already exists", async function () {
    // Arrange
    const metadata = new grpc.Metadata();
    metadata.set("token", TEST_TOKEN);

    const call = {
      metadata,
      request: {
        name: "My Application",
        type: ApplicationType.EXTERNAL,
        endpoint: "localhost:50061"
      }
    };

    const prisma = {
      application: {
        create: sandbox.stub().throws({ code: "P2002" })
      }
    } as unknown as Prisma;

    const { createApplication } = await import(
      "../../src/applications/createApplication"
    );

    // Act
    await createApplication(prisma)(call, (error) => {
      // Assert
      expect(error).to.deep.equal({
        code: grpc.status.ALREADY_EXISTS,
        message: "Duplicated resource"
      });
    });
  });
});
