import { User } from '../protos/usermanager_pb'
import UserOperation from './src/operations/user_operations'
import { use } from 'chai'
import { User as USR } from './src/models/user'

export default async function (email: string) {
  let userOperation = new UserOperation();
  const result = await userOperation.getUserByEmail(email.toString())
  result.status = User.Status.SUSPENDED.toString()
  await userOperation.updateUserStatus(result.email.toString(), result.status)
  return 'completed!'
}
