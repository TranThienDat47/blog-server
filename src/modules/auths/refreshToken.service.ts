import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '~schemas/refreshToken.schema';

@Injectable()
export class RefreshTokenService {
   constructor(@InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshTokenDocument>) {}

   async createRefreshToken(email: string, token: string, expiresAt: Date): Promise<void> {
      return this.refreshTokenModel
         .create({ email, token, expiresAt })
         .then(() => undefined)
         .catch((error) => {
            throw new Error('Failed to create refresh token');
         });
   }

   async isValidRefreshToken(email: string, token: string): Promise<boolean> {
      return this.refreshTokenModel
         .findOne({ email, token })
         .exec()
         .then((refreshToken) => !!refreshToken)
         .catch((error) => {
            throw new Error('Failed to validate refresh token');
         });
   }

   async deleteRefreshToken(email: string, token: string): Promise<void> {
      return this.refreshTokenModel
         .deleteOne({ email, token })
         .exec()
         .then(() => undefined)
         .catch((error) => {
            throw new Error('Failed to delete refresh token');
         });
   }

   async updateRefreshToken(email: string, oldToken: string, newToken: string, expiresAt: Date): Promise<void> {
      return this.refreshTokenModel
         .updateOne({ email, token: oldToken }, { token: newToken, expiresAt })
         .exec()
         .then(() => undefined)
         .catch((error) => {
            throw new Error('Failed to update refresh token');
         });
   }
}
