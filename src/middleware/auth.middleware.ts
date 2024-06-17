import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '~modules/auths/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
   constructor(
      private readonly jwtService: JwtService,
      private readonly authService: AuthService,
   ) {}

   async use(req: Request, res: Response, next: NextFunction) {
      const authHeader = req.headers['authorization'];
      const refreshTokenHeader = req.headers['x-refresh-token'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         throw new UnauthorizedException('Access token is missing or invalid');
      }

      const accessToken = authHeader.substring(7);
      let payload: any;

      try {
         payload = this.jwtService.verify(accessToken);
         if (payload.tokenType !== 'access') {
            throw new UnauthorizedException('Invalid token type');
         }
         req['user'] = payload;
         next();
      } catch (error) {
         if (!refreshTokenHeader || !refreshTokenHeader[0].startsWith('Bearer ')) {
            throw new UnauthorizedException('Refresh token is missing or invalid');
         }

         const refreshToken = refreshTokenHeader[0].substring(7);

         try {
            const refreshPayload = this.jwtService.verify(refreshToken);
            if (refreshPayload.tokenType !== 'refresh') {
               throw new UnauthorizedException('Invalid refresh token type');
            }

            const user = await this.authService.validateUserByEmail(refreshPayload.email);
            if (!user || !(await this.authService.isRefreshTokenValid(user.email, refreshToken))) {
               throw new UnauthorizedException('Invalid refresh token');
            }

            const newTokens = await this.authService.login(user);
            res.setHeader('Authorization', `Bearer ${newTokens.accessToken}`);
            res.setHeader('x-refresh-token', `Bearer ${newTokens.refreshToken}`);

            req['user'] = this.jwtService.verify(newTokens.accessToken);
            next();
         } catch (refreshError) {
            throw new UnauthorizedException('Invalid refresh token');
         }
      }
   }
}
