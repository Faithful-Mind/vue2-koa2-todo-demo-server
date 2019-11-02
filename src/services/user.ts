import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../entities/User';

export async function createNewUser(userName: string, password: string) {
  if (!await getRepository(User).count({ userName })) {
    const pswdBcrypted = await bcrypt.hash(password, 10);
    return getRepository(User).save({ userName, password: pswdBcrypted });
  }
  return null;
}

export async function updateUserPasswordById(id: number, password: string, newPassword:string) {
  const user = await getRepository(User).findOne(id);

  if (user && await bcrypt.compare(password, user.password)) {
    user.password = await bcrypt.hash(newPassword, 10);
    return getRepository(User).save(user);
  }
  return null;
}
