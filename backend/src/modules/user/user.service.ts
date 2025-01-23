import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemes/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { comparePasswords } from '../auth/utils/comparePasswords';
import { hashPassword } from '../auth/utils/hashPassword';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SearchUserDto } from './dtos/search-user.dto';
import { MessageDocument, Message } from 'src/schemes/message.schema';
import { NotificationDocument, Notification } from 'src/schemes/notification.schema';
import { BannedUser, BannedUserDocument } from 'src/schemes/banned-user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(BannedUser.name) private bannedUserModel: Model<BannedUserDocument>,
  ) {}

  async findAll(excludedUserId: string): Promise<UserDocument[]> {
    const objectId = new Types.ObjectId(excludedUserId);
    return this.userModel.find({ _id: { $ne: objectId } }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findOne({email: email}).exec();
    return user;
  }

  async createUser(userData: CreateUserDto): Promise<UserDocument> {
    userData.passwordHash = await hashPassword(userData.passwordHash);
    const user: UserDocument = await this.userModel.create(userData);
    if (user) return user;
    throw new HttpException('user not create', 403);
  }

  async login(login: LoginUserDto): Promise<UserDocument> {
    const user: UserDocument = await this.getUserByEmail(login.email);
    const comparePassword: boolean = await comparePasswords(login.password, user.passwordHash);
    if (comparePassword) {
      return user;
    } 
    else {
      throw new HttpException('invalid password', 403);
    }
  }

  async updateUser(id: ObjectId, updateData: UpdateUserDto): Promise<UserDocument> {
    const updateFields = {};

    for (const key in updateData) {
      if (updateData[key] !== undefined) {
        updateFields[key] = updateData[key];
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateFields }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException('User not found or update failed', 404);
    }

    return updatedUser;
  }

  async deleteProfile(id: Types.ObjectId) {
    await this.notificationModel.deleteMany({
      $or: [
        { sender: id },
        { receiver: id }
      ]
    });
  
    await this.messageModel.deleteMany({
      $or: [
        { sender: id },
        { receiver: id }
      ]
    });
  
    await this.userModel.updateMany(
      { $or: [{ otherlikes: id }, { mylikes: id }, { contacts: id }, { blocked: id }] },
      { 
        $pull: { 
          otherlikes: id,
          mylikes: id,
          contacts: id,
          blocked: id 
        }
      }
    );
  
    await this.bannedUserModel.deleteOne({ blockedUserId: id });
    await this.userModel.findByIdAndDelete(id);
  
    return { message: 'User and associated data deleted successfully' };
  }
  


  async getUserById(id: ObjectId): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(id);
    if (user) return user;
    throw new HttpException('Not Found', 403);
  }

  async getProfile(id: ObjectId): Promise<UserDocument> {
    const curentUser: UserDocument = await this.userModel.findById(id);
    return curentUser;
  }

  async searchUsers(filters: SearchUserDto, excludedUserId: string): Promise<UserDocument[]> {
    const objectId = new Types.ObjectId(excludedUserId);
    const { minAge, maxAge, purpose, location, sortOrder, searchQuery, sex, isBanned } = filters;
    const query = this.userModel.find({ _id: { $ne: excludedUserId },  email: { $ne: 'admin@gmail.com' } });
    const user: UserDocument = await this.userModel.findById(objectId);
    if (minAge) query.where('age').gte(minAge);
    if (maxAge) query.where('age').lte(maxAge);
    if (purpose) query.where('purpose').in(purpose);
    if (location) query.where('location').equals(location);
    if (sex) query.where('sex').equals(sex);
    if (isBanned) {
      if (user.role === "user") query.where('isBanned').equals(isBanned);
      else if (user.role === "admin" && isBanned === "true") {
        query.where('isBanned').equals(isBanned);
      }
    } 
    if (searchQuery) query.where('firstName').regex(new RegExp(searchQuery, 'i'));
    
    return query
      .sort({ age: sortOrder === 'asc' ? 1 : -1 })
      .exec();
  }

  async blockedUser(id: ObjectId, curentUserId: ObjectId): Promise<UserDocument> {
    const curentUser: UserDocument = await this.userModel.findById(curentUserId);
    const objectId = new Types.ObjectId(id.toString());
    curentUser.blocked.push(objectId);
    await curentUser.save(); 
    return curentUser;
  }

  async unblockedUser(id: ObjectId, curentUserId: ObjectId): Promise<UserDocument> {
    const curentUser: UserDocument = await this.userModel.findById(curentUserId);
    const objectId = new Types.ObjectId(id.toString());
    curentUser.blocked = curentUser.blocked.filter((item) => !item.equals(objectId));
    await curentUser.save(); 
    return curentUser;
  }

  async likedUser(id: ObjectId, curentUserId: ObjectId): Promise<UserDocument> {
    const otherUser: UserDocument = await this.userModel.findById(id);
    const curentUser: UserDocument = await this.userModel.findById(curentUserId);
    if (!curentUser || !otherUser) {
        throw new Error("Current user not found");
    }
    const objectId = new Types.ObjectId(id.toString());
    const otherUserId = new Types.ObjectId(curentUserId.toString());
    if (!curentUser.mylikes.includes(objectId) && !otherUser.otherlikes.includes(otherUserId)) {
        curentUser.mylikes.push(objectId);
        otherUser.otherlikes.push(otherUserId);
        await curentUser.save(); 
        await otherUser.save(); 
    }
    return curentUser;
}

async unlikedUser(id: ObjectId, curentUserId: ObjectId): Promise<UserDocument> {
  const curentUser: UserDocument = await this.userModel.findById(curentUserId);
  const objectId = new Types.ObjectId(id.toString());
  const otherUser: UserDocument = await this.userModel.findById(id);
  const otherObjectId = new Types.ObjectId(curentUserId.toString());
  curentUser.mylikes = curentUser.mylikes.filter((item) => !item.equals(objectId));
  otherUser.otherlikes = otherUser.otherlikes.filter((item) => !item.equals(otherObjectId));
  await curentUser.save();
  await otherUser.save();
  return curentUser;
}

async getLikedUser(currentUserId: ObjectId): Promise<UserDocument[]> {
  const currentUser: UserDocument | null = await this.userModel.findById(currentUserId).exec();

  if (!currentUser) {
    throw new Error("Current user not found");
  }

  const likedUserIds: ObjectId[] = currentUser.mylikes as unknown as ObjectId[];

  if (!likedUserIds || likedUserIds.length === 0) {
    return [];
  }

  const likedUsers: UserDocument[] = await this.userModel
    .find({ _id: { $in: likedUserIds } }) 
  return likedUsers;
}


async getChatUsers(currentUserId: String): Promise<UserDocument[]> {
  const messages = await this.messageModel
    .find({
      $or: [
        { sender: currentUserId.toString() },
        { receiver: currentUserId.toString() },
      ],
    })
    .exec();
  const userIds = Array.from(
    new Set(
      messages.flatMap((message) => [
        message.sender.toString(),
        message.receiver.toString(),
      ])
    )
  ).filter((id) => id !== currentUserId.toString());
  const chatUsers = await this.userModel.find({ _id: { $in: userIds } }).exec();

  return chatUsers;
}

async deleteChatsUser(
  currentUserId: string,
  chatId: string
): Promise<UserDocument[]>  {
  const result = await this.messageModel
    .deleteMany({
      $or: [
        { sender: currentUserId.toString(), receiver: chatId.toString() },
        { sender: chatId.toString(), receiver: currentUserId.toString() },
      ]
    })
    .exec();

  return await this.getChatUsers(currentUserId);
}

  async uploadedFile(id: ObjectId, file: string): Promise<UserDocument> {
    const curentUser: UserDocument = await this.userModel.findById(id);
    curentUser.mainPhoto = file;
    await curentUser.save(); 
    return curentUser;
  }

  async getBannedStatus(id: ObjectId): Promise<boolean> {
    const curentUser: UserDocument = await this.userModel.findById(id);
    return  curentUser.isBanned;
  }

  private async getUserByEmail(email: String): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findOne({email:email})
    if (user) return user;
    throw new HttpException('Not Found', 403);
  }  
}