import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BannedUserDocument = BannedUser & Document;

@Schema()
export class BannedUser {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  blockedUserId: Types.ObjectId;
  
}

export const BannedUserSchema = SchemaFactory.createForClass(BannedUser);
