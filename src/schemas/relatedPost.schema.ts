import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from './post.schema';

export type RelatedPostDocument = HydratedDocument<RelatedPost>;

export class RelatedPost {
  @Prop({ required: true })
  parentID: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  postID: Post;
}

export const RelatedPostSchema = SchemaFactory.createForClass(RelatedPost);
