import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Message, MessageDocument } from 'src/schemes/message.schema';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

    async getChat(currentUserId: Types.ObjectId, contactId: Types.ObjectId) {
        
        const chat: MessageDocument[] = await this.messageModel.find({
            $or: [
                { sender: currentUserId.toString(), receiver: contactId.toString() },
                { sender: contactId.toString(), receiver: currentUserId.toString() }
            ]
        }).sort({ timestamp: 1 });
        return chat;
    }

    async updateChat(idMsg: Types.ObjectId, newMessage: string): Promise<MessageDocument | null> {
        const updatedMessage = await this.messageModel.findByIdAndUpdate(
          idMsg,
          { message: newMessage },
        );
        return updatedMessage;
      }

    async deleteMsg(idMsg: Types.ObjectId): Promise<{ success: boolean; message?: string }> {
        const existingMessage = await this.messageModel.findById(idMsg);
    
        if (!existingMessage) {
          throw new NotFoundException('Message not found');
        }
        await this.messageModel.findByIdAndDelete(idMsg);
        return { success: true, message: 'Message deleted successfully' };
      }
}
