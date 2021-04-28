import Storage from "@fonos/storage";
import {App} from "../service/protos/appmanager_pb";
import {View} from "../service/protos/common_pb";
import {FonosService, ServiceOptions} from "@fonos/core";
import {AppManagerClient} from "../service/protos/appmanager_grpc_pb";
import AppManagerPB from "../service/protos/appmanager_pb";
import CommonPB from "../service/protos/common_pb";
import fs from "fs-extra";
import path from "path";
import tar from "tar";
import {nanoid} from "nanoid";
import {promisifyAll} from "grpc-promise";
import grpc from "grpc";

const STATUS = {
  UNKNOWN: 0,
  CREATING: 1,
  RUNNING: 2,
  STOPPED: 3
};

/**
 * @classdesc Use Fonos AppManager, a capability of Fonos Systems Manager,
 * to create, manage, and deploy an applications. Fonos AppManager requires of a
 * running Fonos deployment.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require('@fonos/sdk')
 * const appManager = new Fonos.AppManager()
 *
 * appManager.deployApp('/path/to/app')
 * .then(result => {
 *   console.log(result)             // successful response
 * }).catch(e => console.error(e))   // an error occurred
 */
export default class AppManager extends FonosService {
  storage: Storage;
  /**
   * Application object
   *
   * @typedef {Object} App
   * @property {App.Status} status - Current status of the application.
   * @property {string} name - A name, globally unique, for the application.
   * @property {string} description - A description for the application.
   * @property {number} createTime - Time the application was created.
   * @property {number} updateTime - Last time the application was updated.
   * @property {map} labels - Metadata for this application.
   */

  /**
   * Constructs a new AppManager Object.
   *
   * @see module:core:FonosService
   */
  constructor(options?: ServiceOptions) {
    super(AppManagerClient, options);
    super.init(grpc);
    this.storage = new Storage(super.getOptions());
    this.service = super.getService();
    promisifyAll(super.getService(), {metadata: super.getMeta()});
  }

  /**
   * Deploys an application to Fonos.
   *
   * @param {string} path - path to the application
   * @param {string} ref - optional reference to the application
   * @return {Promise<App>} The application just created
   * @throws if path to application does not exist or is not a directory
   * @throws the file package.json does not exist inside de application path
   * @throws the file package.json is missing the name or description
   * @example
   *
   * const path = '/path/to/project'
   *
   * appManager.deployApp(path)
   * .then(result => {
   *   console.log(result)            // returns the app object
   * }).catch(e => console.error(e))   // an error occurred
   *
   * @todo if the file uploading fails the state of the application should
   * change to UNKNOWN.
   */
  async deployApp(appPath: string, appRef?: string): Promise<App> {
    const dirName = appRef || nanoid(10);
    const packagePath = path.join(appPath, "package.json");
    // Expects an existing valid package.json
    const packageInfo = (p: string) => JSON.parse(`${fs.readFileSync(p)}`);
    let pInfo;

    try {
      pInfo = packageInfo(packagePath);
    } catch (err) {
      throw new Error(
        `Unable to obtain project info. Ensure package.json exists in '${appPath}', and that is well formatted`
      );
    }

    if (!pInfo.main) throw new Error('Missing "main" entry at package.json');

    const mainScript = `${appPath}/${pInfo.main}`;

    if (!fs.existsSync(mainScript))
      throw new Error(`Cannot find main script at "${mainScript}"`);

    const request = {
      dirPath: appPath,
      app: {
        name: pInfo.name,
        description: pInfo.description
      }
    };

    if (
      !fs.existsSync(request.dirPath) ||
      !fs.lstatSync(request.dirPath).isDirectory()
    ) {
      throw new Error(
        `${request.dirPath} does not exist or is not a directory`
      );
    }

    if (!fs.existsSync(packagePath)) {
      throw new Error(`not package.json found in ${request.dirPath}`);
    }

    // Cleanup before deploy
    if (fs.existsSync(`/tmp/${dirName}`))
      fs.rmdirSync(`/tmp/${dirName}`, {recursive: true});
    if (fs.existsSync(`/tmp/${dirName}.tgz`)) fs.unlink(`/tmp/${dirName}.tgz`);

    await fs.copy(request.dirPath, `/tmp/${dirName}`);
    await tar.create({file: `/tmp/${dirName}.tgz`, cwd: "/tmp"}, [dirName]);
    await this.storage.uploadObject({
      filename: `/tmp/${dirName}.tgz`,
      bucket: "apps" // TODO: Maybe I should place this in the .env
    });

    // Cleanup after deploy
    if (fs.existsSync(`/tmp/${dirName}`))
      fs.rmdirSync(`/tmp/${dirName}`, {recursive: true});
    if (fs.existsSync(`/tmp/${dirName}.tgz`)) fs.unlink(`/tmp/${dirName}.tgz`);

    const app = new AppManagerPB.App();
    app.setRef(dirName);
    app.setName(request.app.name);
    app.setDescription(request.app.description);

    const createAppRequest = new AppManagerPB.CreateAppRequest();
    createAppRequest.setApp(app);

    const response = await this.service
      .createApp()
      .sendMessage(createAppRequest);

    return response;
  }

  /**
   * Retrives an application by reference.
   *
   * @param {string} ref - The reference to the application
   * @return {Promise<App>} The application
   * @throws if name is null or application does not exist
   * @example
   *
   * appManager.getApp(name)
   * .then(result => {
   *   console.log(result)             // returns the app object
   * }).catch(e => console.error(e))   // an error occurred
   */
  async getApp(ref: string): Promise<App> {
    const request = new AppManagerPB.GetAppRequest();
    request.setRef(ref);
    return this.service.getApp().sendMessage(request);
  }

  /**
   * Deletes an application create on Fonos server.
   *
   * @param {string} ref - The reference to the application
   * @return {Promise<App>} The application to remove
   * @throws if the application is not found
   * @example
   *
   * appManager.deleteApp(ref)
   * .then(() => {
   *   console.log('finished')        // returns an empty object
   * }).catch(e => console.error(e))  // an error occurred
   */
  async deleteApp(ref: string) {
    const request = new AppManagerPB.DeleteAppRequest();
    request.setRef(ref);
    return this.service.deleteApp().sendMessage(request);
  }

  /**
   * List the applications registered in Fonos.
   *
   * @param {Object} request
   * @param {number} request.pageSize - Number of element per page
   * (defaults to 20)
   * @param {string} request.pageToken - The next_page_token value returned from
   * a previous List request, if any
   * @return {Promise<ListAppsResponse>} List of applications
   * @example
   *
   * const request = {
   *    pageSize: 20,
   *    pageToken: 2
   * }
   *
   * appManager.listApps(request)
   * .then(result => {
   *   console.log(result)            // returns a ListAppsResponse
   * }).catch(e => console.error(e))  // an error occurred
   */
  async listApps(request: {pageSize: number; pageToken: string; view: View}) {
    const r = new AppManagerPB.ListAppsRequest();
    r.setPageSize(request.pageSize);
    r.setPageToken(request.pageToken);
    r.setView(request.view);
    return this.service.listApps().sendMessage(r);
  }

  static get STATES() {
    return STATUS;
  }
}

export {AppManagerPB, CommonPB};
