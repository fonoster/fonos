import {
  FonosService,
  ServiceOptions
} from "@fonos/core";
import {
  UserManagerClient
} from "../service/protos/usermanager_grpc_pb";
import UserManagerPB from "../service/protos/usermanager_pb";
import CommonPB from "../service/protos/common_pb";
import { promisifyAll } from "grpc-promise";
import grpc from "grpc";

interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  accessKeyId: string;
  role: string;
  createTime: string;
  updateTime: string;
  status: string;
}

/**
 * @classdesc Use Fonos UserManager, a capability of Fonos Systems Manager,
 * to create and manage users and roles. Fonos UserManager requires of a
 * running Fonos deployment.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require('@fonos/sdk')
 * const users = new Fonos.UserManager()
 *
 * TODO: Adde example
 */
export default class UserManager extends FonosService {
  /**
   * Constructs a new AppManager Object.
   *
   * @see module:core:FonosService
   */
  constructor(options?: ServiceOptions) {
    super(UserManagerClient, options);
    super.init(grpc);
    promisifyAll(super.getService(), {metadata: super.getMeta()});
  }

  async createUser(request: CreateUserRequest): Promise<User> {
    const user = new UserManagerPB.User();
    user.setFirstName(request.firstName);
    user.setLastName(request.lastName);
    user.setEmail(request.email);
    const req = new UserManagerPB.CreateUserRequest();
    req.setUser(user);

    const userFromDatabase = await super
      .getService()
      .createUser()
      .sendMessage(req);

    return {
      firstName: userFromDatabase.getFirstName(),
      lastName: userFromDatabase.getLastName(),
      email: userFromDatabase.getEmail(),
      accessKeyId: userFromDatabase.getAccessKeyId(),
      role: userFromDatabase.getRole(),
      createTime: userFromDatabase.getCreateTime(),
      updateTime: userFromDatabase.getUpdateTime(),
      status: userFromDatabase.getStatus()
    };
  }
}

export {UserManagerPB, CommonPB}