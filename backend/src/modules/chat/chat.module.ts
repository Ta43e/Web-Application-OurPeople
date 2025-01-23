import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemes/user.schema';
import { ChatService } from './chat.service';
import { UserController } from '../user/user.controller';
import { ChatController } from './chat.controller';
import { Message, MessageSchema } from 'src/schemes/message.schema';
import { SocketGateway } from './socket';
import { NotificationSchema, Notification } from 'src/schemes/notification.schema';

@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}]),
        MongooseModule.forFeature([{name: Notification.name, schema: NotificationSchema}])
    ],
    providers: [ChatService, SocketGateway],
    controllers: [ChatController],
    exports: [ChatService]
}) 
export class ChatModule {}
