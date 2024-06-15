import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

export class Category {
  @Prop({ required: true })
  parentID: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
