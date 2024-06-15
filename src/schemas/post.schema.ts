import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  img: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  subname: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: 'Bản nháp' })
  status: string;

  @Prop({ required: true })
  keySearch: string;

  @Prop({ required: true, default: true })
  isNew: boolean;

  @Prop({ required: true, default: 0 })
  views: number;

  @Prop({ required: true, default: 0 })
  reacts: number;

  @Prop({ required: true, default: 0 })
  countComments: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre('save', function (next) {
  if (!this.keySearch) {
    this.keySearch = `${this.name} ${this.subname} ${this.description}`;
  }
  next();
});
