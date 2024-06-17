import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '~modules/users/user.service';
import { User } from '~schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RefreshTokenService } from './refreshToken.service';
import { AuthDTO } from '~dto/auths/auth.dto';

@Injectable()
export class AuthService {
   constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      private readonly refreshTokenService: RefreshTokenService,
   ) {}

   async validateUser(email: string, password: string): Promise<User | null> {
      const user = await this.userService.findUserByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
         return user;
      }
      return null;
   }

   async validateUserByEmail(email: string): Promise<User | null> {
      return await this.userService.findUserByEmail(email);
   }

   async login(user: User): Promise<AuthDTO> {
      const accessTokenPayload = { email: user.email, tokenType: 'access' };
      const refreshTokenPayload = { email: user.email, tokenType: 'refresh' };

      const accessToken = this.jwtService.sign(accessTokenPayload, { expiresIn: '10s' });
      const refreshToken = this.jwtService.sign(refreshTokenPayload, { expiresIn: '30d' });

      await this.refreshTokenService.createRefreshToken(user.email, refreshToken);

      return { accessToken, refreshToken };
   }

   async isRefreshTokenValid(email: string, token: string): Promise<boolean> {
      return await this.refreshTokenService.isValidRefreshToken(email, token);
   }

   async refreshAccessToken(refreshToken: string): Promise<AuthDTO> {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserByEmail(payload.email);

      if (!user || !(await this.refreshTokenService.isValidRefreshToken(user.email, refreshToken))) {
         throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign({ email: user.email }, { expiresIn: '15m' });
      const refreshTokenNew = this.jwtService.sign({ email: user.email }, { expiresIn: '30d' });

      return { accessToken, refreshToken: refreshTokenNew };
   }
}
