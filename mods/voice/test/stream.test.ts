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
import {
  StartStreamRequest,
  StreamAudioFormat,
  StreamDirection,
  StreamMessageType
} from "@fonoster/common";
import * as chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { createSandbox, match } from "sinon";
import sinonChai from "sinon-chai";
import { getVoiceObject, sessionRef, voiceRequest } from "./helpers";

chai.use(chaiAsPromised);
chai.use(sinonChai);
const sandbox = createSandbox();

describe("@voice/verbs/stream", function () {
  afterEach(function () {
    return sandbox.restore();
  });

  it("should create an audio stream", async function () {
    // Arrange
    const { StartStream } = await import("../src/verbs/Stream");

    const voice = getVoiceObject(sandbox, "startStreamResponse");

    const startStream = new StartStream(voiceRequest, voice);

    const startStreamRequest: StartStreamRequest = {
      sessionRef,
      direction: StreamDirection.IN,
      format: StreamAudioFormat.WAV
    };

    // Act
    await startStream.run(startStreamRequest);

    // Assert
    expect(voice.removeListener).to.have.been.calledOnce;
    expect(voice.on).to.have.been.calledOnce;
    expect(voice.on).to.have.been.calledWith("data", match.func);
    expect(voice.write).to.have.been.calledOnce;
    expect(voice.write).to.have.been.calledWith({
      startStreamRequest
    });
  });

  it("should allow streaming audio in and out", async function () {
    // Arrange
    const { VoiceResponse } = await import("../src/VoiceResponse");

    const onStub = sandbox
      .stub()
      .onFirstCall()
      .callsFake((_, cb) => {
        cb({ content: "startStreamResponse" });
      });

    const voice = {
      removeListener: sandbox.stub(),
      on: onStub,
      once: sandbox.stub(),
      write: sandbox.stub(),
      end: sandbox.stub()
    };
    const voiceResponse = new VoiceResponse(voiceRequest, voice);

    const dummyCallback = sandbox.stub();

    // Act
    const stream = await voiceResponse.stream({
      direction: StreamDirection.BOTH,
      format: StreamAudioFormat.WAV
    });

    // This will be called twice
    stream.onPayload(dummyCallback);

    // First chunk in
    stream.write({
      sessionRef,
      streamRef: "streamRef",
      format: StreamAudioFormat.WAV,
      type: StreamMessageType.AUDIO_IN,
      data: Buffer.from("data")
    });

    // First chunk out
    voice.on.yield({
      streamPayload: {
        type: StreamMessageType.AUDIO_OUT,
        data: Buffer.from("data")
      }
    });

    // Second chunk in
    stream.write({
      sessionRef,
      streamRef: "streamRef",
      format: StreamAudioFormat.WAV,
      type: StreamMessageType.AUDIO_IN,
      data: Buffer.from("data")
    });

    // Second chunk out
    voice.on.yield({
      streamPayload: {
        type: StreamMessageType.AUDIO_OUT,
        data: Buffer.from("data")
      }
    });

    // Assert
    expect(dummyCallback).to.have.been.calledTwice;

    expect(dummyCallback).to.have.been.calledWith({
      type: StreamMessageType.AUDIO_OUT,
      data: Buffer.from("data")
    });

    expect(voice.write).to.have.been.calledThrice;

    expect(voice.write).to.have.been.calledWith({
      startStreamRequest: {
        sessionRef,
        direction: StreamDirection.BOTH,
        format: StreamAudioFormat.WAV
      }
    });

    expect(voice.write).to.have.been.calledWith({
      streamPayload: {
        sessionRef,
        streamRef: "streamRef",
        format: StreamAudioFormat.WAV,
        type: StreamMessageType.AUDIO_IN,
        data: Buffer.from("data")
      }
    });
  });
});
