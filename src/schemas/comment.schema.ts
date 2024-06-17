import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '~schemas/user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  parentID: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userID: User;

  @Prop({ required: true })
  cotent: string;

  @Prop({ default: false, required: true })
  isReply: boolean;

  @Prop({ default: false, required: true })
  read: boolean;

  @Prop({ required: true, default: 0 })
  reacts: number;

  @Prop({ required: true, default: 0 })
  countReplies: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
