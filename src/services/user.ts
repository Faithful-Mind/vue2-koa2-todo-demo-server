import bcrypt from 'bcrypt';
import { UserRepo } from '../entities/User';

export async function createNewUser(userName: string, password: string) {
  if (!await UserRepo().count({ userName })) {
    const pswdBcrypted = await bcrypt.hash(password, 10);
    return UserRepo().save({ userName, password: pswdBcrypted });
  }
  return null;
}

export async function updateUserPasswordById(id: number, password: string, newPassword:string) {
  const user = await UserRepo().findOne(id);

  if (user && await bcrypt.compare(password, user.password)) {
    user.password = await bcrypt.hash(newPassword, 10);
    return UserRepo().save(user);
  }
  return null;
}
