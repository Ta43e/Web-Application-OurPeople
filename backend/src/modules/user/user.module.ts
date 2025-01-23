import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemes/user.schema';
import { IsUniqueLogin } from './utils/vakidate-email';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseService } from '../firebase/firebase-service';
import { NotificationSchema, Notification } from "src/schemes/notification.schema";
import { NotificationService } from '../notification/notification.service';
import { MessageSchema, Message } from 'src/schemes/message.schema';
import { BannedUser, BannedUserSchema } from 'src/schemes/banned-user.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{name: Notification.name, schema: NotificationSchema}]),
    MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}]),
    MongooseModule.forFeature([{name: BannedUser.name, schema: BannedUserSchema}]),
  ],
  controllers: [UserController],
  providers: [UserService, FirebaseService, NotificationService],
  exports: [UserService, FirebaseService, NotificationService],
})
export class UserModule {}

export { User };
 