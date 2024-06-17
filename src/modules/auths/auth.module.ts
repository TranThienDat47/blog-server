import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UserService } from '~modules/users/user.service';
import { User, UserSchema } from '~schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from '~schemas/refreshToken.schema';
import { AuthController } from './auth.controller';
import { RefreshTokenService } from './refreshToken.service';
import { AuthMiddleware } from '~middleware/auth.middleware';

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: User.name, schema: UserSchema },
         { name: RefreshToken.name, schema: RefreshTokenSchema },
      ]),
      JwtModule.register({
         secret: process.env.ACCESS_TOKEN_SECRET,
      }),
   ],
   controllers: [AuthController],
   providers: [AuthService, UserService, RefreshTokenService],
})
export class AuthModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware).forRoutes('/api/user/*');
   }
}
