import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from './Common.entity';
import { User } from './User.entity';
import { Chat } from './Chat.entity';
@Entity()
export class MessageEntity extends CommonEntity {
  @OneToOne(() => User)
  @JoinColumn()
  sender: User;
  @Column()
  message: string;
  @Column({ type: 'json', default: [] })
  readBy: number[];
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;
}