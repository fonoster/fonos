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
import { Channel } from "ari-client";
import * as chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { NatsConnection } from "nats";
import { createSandbox } from "sinon";
import sinonChai from "sinon-chai";
import { getAriStub, getCreateVoiceClient } from "./helper";

chai.use(chaiAsPromised);
chai.use(sinonChai);
const sandbox = createSandbox();

const channelId = "channel-id";

describe("@voice/handler/StasisEnd", function () {
  afterEach(function () {
    return sandbox.restore();
  });

  it("should handle a StasisEnd event", async function () {
    // Arrange
    const { VoiceDispatcher } = await import("../../src/voice/VoiceDispatcher");

    const ari = getAriStub(sandbox);
    const nc = {} as unknown as NatsConnection;
    const createVoiceClient = getCreateVoiceClient(sandbox);
    const voiceDispatcher = new VoiceDispatcher(ari, nc, createVoiceClient);

    const channel = {
      id: channelId,
      getChannelVar: sandbox.stub().resolves({ value: "value" }),
      Channel: sandbox.stub(),
      originate: sandbox.stub(),
      on: sandbox.stub(),
      hangup: sandbox.stub()
    } as unknown as Channel;

    voiceDispatcher.voiceClients.set(channelId, createVoiceClient());

    // Act
    voiceDispatcher.handleStasisEnd(undefined, channel);

    // Assert
    expect(createVoiceClient().close).to.have.been.calledOnce;
    expect(voiceDispatcher.voiceClients.get(channelId)).to.not.exist;
    expect(channel.getChannelVar).to.have.been.not.called;
  });
});
