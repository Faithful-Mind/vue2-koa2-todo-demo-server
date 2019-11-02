import {
  Column, Entity, PrimaryGeneratedColumn, getRepository,
} from 'typeorm';


@Entity('user', { schema: 'molunerfinn_vue-koa-todolist' })
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id!: number;

  @Column('varchar', {
    nullable: false,
    length: 50,
    name: 'user_name',
  })
  userName!: string;

  @Column('varchar', {
    nullable: false,
    length: 128,
    name: 'password',
  })
  password!: string;
}

export function UserRepo() {
  return getRepository(User);
}
