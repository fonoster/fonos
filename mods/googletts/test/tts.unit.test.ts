import GoogleTTS from "../src/tts";
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import path from "path";

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();
const sandbox = sinon.createSandbox();

describe("@fonos/googletts", () => {
  afterEach(() => sandbox.restore());

  it("rejects if the TTS because could not find any credentials", async () => {
    const client = new textToSpeech.TextToSpeechClient();
    const join = sandbox.spy(path, "join");
    const synthesizeSpeech = sandbox.spy(client, "synthesizeSpeech");
    const writeFile = sandbox.spy(fs, "writeFile");
    const tts = new GoogleTTS({
      projectId: "",
      keyFilename: ""
    });

    await expect(tts.synthetize("hello world")).to.be.eventually.rejectedWith(
      "Could not load the default credentials."
    );
    expect(join).to.have.been.called;
    expect(writeFile).to.not.have.been.called;
    expect(synthesizeSpeech).to.not.have.been.called;
  });

  it("synthesizes text and returns path to file", async () => {
    const synthesizeSpeechStub = sandbox
      .stub(textToSpeech.TextToSpeechClient.prototype, "synthesizeSpeech")
      .resolves([{audioContent: "some-audio"}]);
    const writeFile = sandbox.spy(fs, "writeFile");
    const join = sandbox.spy(path, "join");
    const config = {
      projectId: "project-id",
      keyFilename: "path-to-file"
    };

    const tts = new GoogleTTS(config);
    const result = await tts.synthetize(
      "Hello Kayla, how are you doing today?",
      {
        ssmlGender: "FEMALE"
      }
    );

    expect(join).to.have.been.calledOnce;
    expect(writeFile).to.have.been.calledOnce;
    expect(synthesizeSpeechStub).to.have.been.calledOnce;
    expect(result).to.have.property("filename").to.not.be.null;
    expect(result).to.have.property("pathToFile").to.not.be.null;
  });
});
