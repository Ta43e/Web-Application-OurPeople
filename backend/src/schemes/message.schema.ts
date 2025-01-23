import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Document & Message;

@Schema()
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ default: false })
  status: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
