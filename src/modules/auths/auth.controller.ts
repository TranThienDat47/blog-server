import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, AuthDTO } from '~dto/auths/auth.dto';
import { ResponseData } from '~globals/globalClass';
import { HttpMessage, HttpStatus } from '~globals/globalEnum';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('login')
   async login(@Body() loginDTO: LoginDTO): Promise<ResponseData<AuthDTO | AuthDTO[]>> {
      return this.authService
         .validateUser(loginDTO.email, loginDTO.password)
         .then((user) => {
            if (!user) {
               throw new UnauthorizedException('Invalid credentials');
            }

            return this.authService.login(user);
         })
         .then((result) => new ResponseData<AuthDTO | AuthDTO[]>(true, result, HttpMessage.SUCCESS, HttpStatus.SUCCESS))
         .catch(
            (error) =>
               new ResponseData<AuthDTO | AuthDTO[]>(
                  false,
                  null,
                  HttpMessage.UNAUTHORIZED + ` (${error})`,
                  HttpStatus.UNAUTHORIZED,
               ),
         );
   }

   @Post('refresh-token')
   async refreshAccessToken(@Body() refreshDTO: AuthDTO): Promise<AuthDTO> {
      return this.authService
         .refreshAccessToken(refreshDTO.refreshToken)
         .then((result) => result)
         .catch((error) => {
            throw new UnauthorizedException('Invalid refresh token');
         });
   }
}
