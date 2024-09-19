import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Chat } from 'src/database/entities/Chat.entity';
  import { MessageEntity } from 'src/database/entities/Message.entity';
  import { In, Repository } from 'typeorm';
  import { SendMessageDto } from './dto/send-message.dto';
  import { ClsService } from 'nestjs-cls';
  import { User } from 'src/database/entities/User.entity';
  @Injectable()
  export class ChatService {
    constructor(
      private cls: ClsService,
      @InjectRepository(Chat)
      private chatRepo: Repository<Chat>,
      @InjectRepository(MessageEntity)
      private messageRepo: Repository<MessageEntity>,
    ) {}
    async findOrCreateChat(params: { chatId?: number; userId?: number }) {
      let { chatId, userId } = params;
      const myUser = await this.cls.get<User>('user');
      let chat: Chat;
      if (userId) {
        chat = await this.chatRepo
          .createQueryBuilder('chat')
          .leftJoin('chat.users', 'users')
          .where(`users.id IN(:...ids)`, { ids: [myUser.id, userId] })
          .getOne();
        //  Using Repository API
        //   chat = await this.chatRepo.findOne({
        //     where: {
        //       users: {
        //         id: In([myUser.id, userId]),
        //       },
        //     },
        //     relations: ['users'],
        //   });
        if (!chat) {
          chat = this.chatRepo.create({
            isGroup: false,
            users: [
              {
                id: myUser.id,
              },
              {
                id: userId,
              },
            ],
          });
          await chat.save();
        }
      } else if (chatId) {
        chat = await this.chatRepo.findOne({
          where: { id: chatId },
          relations: ['users'],
        });
        if (!chat || !chat.users.find((user) => user.id === myUser.id)) {
          throw new NotFoundException();
        }
      } else return false;
      return chat;
    }
    async sendMessage(params: SendMessageDto) {
      let { userId, chatId } = params;
      let myUser = await this.cls.get<User>('user');
      let chat = await this.findOrCreateChat({ userId, chatId });
      if (!chat) throw new BadRequestException();
      let message = this.messageRepo.create({
        chat: {
          id: chat.id,
        },
        message: params.messsage,
        readBy: [myUser.id],
      });
      await message.save();
      return { chat, message };
    }
  }