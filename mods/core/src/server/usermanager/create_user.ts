//import redis from '../../common/redis'
import { User } from '../protos/usermanager_pb'
import UserOperation from './src/operations/user_operations'
const objectid = require('objectid')

export default async function (user: User): Promise<User> {
  let userOperation = new UserOperation();
  user.setAccessKeyId(objectid().toString())
  user.setStatus(User.Status.ACTIVE)
  user.setRole("USER")
  user.setCreateTime(new Date().toString())
  user.setUpdateTime(new Date().toString())
  await userOperation.saveUser(user.toObject())
  return user
}
