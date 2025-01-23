import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemes/user.schema';
import { MessageDocument, Message } from 'src/schemes/message.schema';
import { NotificationDocument, Notification } from 'src/schemes/notification.schema';
import { BannedUser, BannedUserDocument } from 'src/schemes/banned-user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(BannedUser.name) private bannedUserModel: Model<BannedUserDocument>,
  ) {}


async getAllBannedUser(): Promise<BannedUserDocument[]> {
  const bannedUsers: BannedUserDocument[] = await this.bannedUserModel.find();
  return bannedUsers;
} 

async getAllUsersWithBannedUsers(id: string): Promise<UserDocument[]> {
  const objectId = new Types.ObjectId(id);
  const bannedUsers: UserDocument[] = await this.userModel.find({ _id: { $ne: objectId } }).exec();
  return bannedUsers;
} 

async banInfo(idUser: string) {
  const objectId = new Types.ObjectId(idUser);
  const bannedUser = await this.bannedUserModel.findOne({blockedUserId: objectId});
  console.log(bannedUser);
  const message = bannedUser ? bannedUser.message : "d "; 
  return {message: message};  
}

  async banUser(idUser: string, message: string) {
    const objectId = new Types.ObjectId(idUser);
    const bannedUser = await this.userModel
    .findByIdAndUpdate(objectId, { $set: {isBanned: true} }, { new: true })
    .exec();
    const bannedUserShema = {
      email: bannedUser.email,
      message: message,
      blockedUserId: bannedUser._id,
    }
    await (await this.bannedUserModel.create(bannedUserShema)).save();
    return {bannedUser: bannedUser, message: message};  
  }

  async unBanUser(idUser: string) {
    const objectId = new Types.ObjectId(idUser);
    const unbannedUser = await this.userModel
      .findByIdAndUpdate(objectId, { $set: { isBanned: false } }, { new: true })
      .exec();
  
    if (!unbannedUser) {
      throw new Error('User not found or already unbanned');
    }
    await this.bannedUserModel.deleteOne({ blockedUserId: objectId }).exec();
    
    return unbannedUser;
  }
}