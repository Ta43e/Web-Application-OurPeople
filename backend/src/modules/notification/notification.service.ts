import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemes/user.schema';
import { NotificationDocument, Notification } from 'src/schemes/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async getNotification(id: ObjectId): Promise<NotificationDocument[]> {
    const notification: NotificationDocument[] = await this.notificationModel.find({receiver: id});
    return notification;
  }

  async getUnreadNotification(id: ObjectId): Promise<NotificationDocument[]> {
    const notification: NotificationDocument[] = await this.notificationModel.find({receiver: id, status: false});
    return notification;
  }

  async deleteNotification(id: ObjectId, idNotification: ObjectId): Promise<NotificationDocument[]> {
    await this.notificationModel.findByIdAndDelete(idNotification)
    const notification: NotificationDocument[] = await this.notificationModel.find({receiver: id});
    return notification;
  }

  async openNotification(id: ObjectId, idNotification: ObjectId): Promise<NotificationDocument[]> {
    const notification: NotificationDocument = await this.notificationModel.findById(idNotification);
    notification.status = true;
    notification.save();
    const notifications: NotificationDocument[] = await this.notificationModel.find({receiver: id});
    return notifications;
  }
}