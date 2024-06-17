import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
export type RefreshTokenDocument = RefreshToken & Document;

export class RefreshToken {
   @Prop({ required: true })
   email: string;

   @Prop({ required: true })
   token: string;

   @Prop({ required: true, default: Date.now })
   updatedAt: Date;

   @Prop({ required: true })
   expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.pre<RefreshTokenDocument>('save', function (next) {
   this.updatedAt = new Date();
   this.expiresAt = new Date(this.updatedAt);
   this.expiresAt.setDate(this.expiresAt.getDate() + 30);
   next();
});
