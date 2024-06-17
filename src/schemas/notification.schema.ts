import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '~schemas/user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
   refID: mongoose.Schema.Types.ObjectId;

   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
   userID: User;

   @Prop({ required: true })
   title: string;

   @Prop({ required: true })
   content: string;

   @Prop({ default: false, required: true })
   read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
