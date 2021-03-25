import { FonosService, UserManagerService, UserManagerPB } from '@fonos/core'
import {CreateUserRequest, CreateUserResponse} from './types'

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
  constructor (options?: any) {
    super(UserManagerService.UserManagerClient, options)
    super.init()
    const { promisifyAll } = require('grpc-promise')
    promisifyAll(super.getService(), { metadata: super.getMeta() })
  }

  async createUser (request: CreateUserRequest): Promise<CreateUserResponse> {
    const user = new UserManagerPB.User();
    user.setFirstName(request.firstName)
    user.setLastName(request.lastName)
    user.setEmail(request.email)
    const req = new UserManagerPB.CreateUserRequest()
    req.setUser(user);

    const userFromDatabase =  await super
    .getService()
    .createUser()
    .sendMessage(req)

    return {
      firstName: userFromDatabase.getFirstName(),
      lastName: userFromDatabase.getLastName(),
      email : userFromDatabase.getEmail(),
      accessKeyId : userFromDatabase.getAccessKeyId(),
      role : userFromDatabase.getRole(),
      createTime : userFromDatabase.getCreateTime(),
      updateTime : userFromDatabase.getUpdateTime(),
      status : userFromDatabase.getStatus()
    }
  }
}
