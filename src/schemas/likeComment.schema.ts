import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Comment } from './comment.schema';

export type LikeCommentDocument = HydratedDocument<LikeComment>;

export class LikeComment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  })
  commentID: Comment;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userID: User;
}

export const LikeCommentSchema = SchemaFactory.createForClass(LikeComment);
