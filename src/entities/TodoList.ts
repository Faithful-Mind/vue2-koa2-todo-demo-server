import {
  Column, Entity, PrimaryGeneratedColumn, getRepository,
} from 'typeorm';


@Entity('list', { schema: 'molunerfinn_vue-koa-todolist' })
export class TodoList {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id!: number;

  @Column('int', {
    nullable: false,
    name: 'user_id',
  })
  userId!: number;

  @Column('varchar', {
    nullable: false,
    name: 'content',
  })
  content!: string;

  @Column('tinyint', {
    nullable: false,
    width: 1,
    default: () => 0,
    name: 'status',
  })
  status!: boolean;
}

export function TodoRepo() {
  return getRepository(TodoList);
}
