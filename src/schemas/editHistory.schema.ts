import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type EditHistoryDocument = HydratedDocument<EditHistory>;

@Schema({ timestamps: true })
export class EditHistory {
  @Prop({ required: true })
  commentID: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  newContent: string;

  @Prop({ required: true })
  oldContent: string;
}

export const EditHistorySchema = SchemaFactory.createForClass(EditHistory);
