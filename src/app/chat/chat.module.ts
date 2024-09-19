import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/database/entities/Chat.entity';
import { MessageEntity } from 'src/database/entities/Message.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
@Module({
  imports: [TypeOrmModule.forFeature([Chat, MessageEntity])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}