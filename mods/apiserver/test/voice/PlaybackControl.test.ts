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
import { PlaybackControlAction } from "@fonoster/common";
import * as chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { createSandbox } from "sinon";
import sinonChai from "sinon-chai";
import { getAriStub, getCreateVoiceClient } from "./helper";
import { playbackControlHandler } from "../../src/voice/handlers/PlaybackControl";

chai.use(chaiAsPromised);
chai.use(sinonChai);
const sandbox = createSandbox();

const channelId = "channel-id";

describe("@voice/handler/PlaybackControl", function () {
  afterEach(function () {
    return sandbox.restore();
  });

  it("should handle a PlaybackControl command", async function () {
    // Arrange
    const ari = getAriStub(sandbox);

    const createVoiceClient = getCreateVoiceClient(sandbox);

    const playbackControlRequest = {
      playbackRef: "playback-id",
      sessionRef: channelId,
      action: PlaybackControlAction.FORWARD
    };

    // Act
    await playbackControlHandler(
      ari,
      createVoiceClient()
    )(playbackControlRequest);

    // Assert
    expect(ari.playbacks.control).to.have.been.calledOnce;
    expect(createVoiceClient().sendResponse).to.have.been.calledOnce;
    expect(createVoiceClient().sendResponse).to.have.been.calledWith({
      playbackControlResponse: {
        sessionRef: playbackControlRequest.sessionRef
      }
    });
    expect(ari.playbacks.control).to.have.been.calledWith({
      playbackId: playbackControlRequest.playbackRef,
      operation: playbackControlRequest.action
    });
  });

  it("should handle a STOP PlaybackControl command", async function () {
    // Arrange
    const ari = getAriStub(sandbox);

    const createVoiceClient = getCreateVoiceClient(sandbox);

    const playbackControlRequest = {
      playbackRef: "playback-id",
      sessionRef: channelId,
      action: PlaybackControlAction.STOP
    };

    // Act
    await playbackControlHandler(
      ari,
      createVoiceClient()
    )(playbackControlRequest);

    // Assert
    expect(ari.playbacks.stop).to.have.been.calledOnce;
    expect(createVoiceClient().sendResponse).to.have.been.calledOnce;
    expect(createVoiceClient().sendResponse).to.have.been.calledWith({
      playbackControlResponse: {
        sessionRef: playbackControlRequest.sessionRef
      }
    });
    expect(ari.playbacks.stop).to.have.been.calledWith({
      playbackId: playbackControlRequest.playbackRef
    });
  });
});
