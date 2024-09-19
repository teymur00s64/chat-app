import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
  } from 'typeorm';
  import { CommonEntity } from './Common.entity';
  import { User } from './User.entity';
  import { MessageEntity } from './Message.entity';
  @Entity()
  export class Chat extends CommonEntity {
    @ManyToMany(() => User)
    @JoinTable({ name: 'user_chat' })
    users: User[];
    @Column()
    isGroup: boolean;
    @OneToMany(() => MessageEntity, (message) => message.chat)
    messages: MessageEntity;
  }