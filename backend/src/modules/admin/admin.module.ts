import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemes/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseService } from '../firebase/firebase-service';
import { NotificationSchema, Notification } from "src/schemes/notification.schema";
import { NotificationService } from '../notification/notification.service';
import { MessageSchema, Message } from 'src/schemes/message.schema';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BannedUser, BannedUserSchema } from 'src/schemes/banned-user.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{name: Notification.name, schema: NotificationSchema}]),
    MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}]),
    MongooseModule.forFeature([{name: BannedUser.name, schema: BannedUserSchema}]),
  ],
  controllers: [AdminController],
  providers: [AdminService, UserService, FirebaseService, NotificationService],
  exports: [AdminService, UserService, FirebaseService, NotificationService],
})
export class AdminModule {}

 