import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from '~modules/auths/auth.module';
import { AuthMiddleware } from '~middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
   imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.MONGODB_URL),

      UserModule,
      AuthModule,

      RouterModule.register([
         {
            path: 'api',
            children: [UserModule, AuthModule],
         },
      ]),
   ],
})
export class AppModule {}
