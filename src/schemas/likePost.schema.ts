import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Post } from './post.schema';

export type LikePostDocument = HydratedDocument<LikePost>;

export class LikePost {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  })
  commentID: Post;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userID: User;
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);
