import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { boolean } from 'joi';
import { Document, Types } from 'mongoose';

export type UserDocument = Document & User;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, enum: ['мужчина', 'женщина'] })
  sex: 'мужчина' | 'женщина';

  @Prop({  })
  passwordHash: string;

  @Prop({  })
  age: number;

  @Prop({ type: [String] })
  purpose: string[];

  @Prop({ required: true })
  mainPhoto: string;

  @Prop({ type: [String] })
  photos: string[];

  @Prop({  })
  location: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  otherlikes: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  mylikes: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  contacts: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  blocked: Types.ObjectId[];

  @Prop({ required: true, default: false})
  iiGoogle: boolean;

  @Prop({ required: true, default: false})
  isBanned: boolean;

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);
 

