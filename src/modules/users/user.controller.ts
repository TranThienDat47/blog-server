import { Controller, Get, Param, Post, Body, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseData } from '~globals/globalClass';
import { User } from '~schemas/user.schema';
import { HttpMessage, HttpStatus } from '~globals/globalEnum';
import { CreateUserDTO } from '~dto/users/createUserDTO';
import { LoginUserDTO } from '~dto/users/loginUserDTO';
import { UpdateUserDTO } from '~dto/users/updateUserDTO';

@Controller('user')
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Post('register')
   async register(@Body() createUserDTO: CreateUserDTO): Promise<ResponseData<User>> {
      return this.userService
         .createUser(createUserDTO)
         .then((newUser) => new ResponseData<User>(true, newUser, HttpMessage.SUCCESS, HttpStatus.SUCCESS))
         .catch(
            (error) =>
               new ResponseData<User>(false, null, HttpMessage.BAD_REQUEST + ` (${error})`, HttpStatus.BAD_REQUEST),
         );
   }

   @Get('find')
   async findUsers(
      @Query('skip') skip: number,
      @Query('limit') limit: number,
      @Query('key') key: string,
      @Query('sort') sort: number,
   ): Promise<ResponseData<User[]>> {
      return this.userService
         .findUsers(skip, limit, key, sort)
         .then((users) => new ResponseData<User[]>(true, users, HttpMessage.SUCCESS, HttpStatus.SUCCESS))
         .catch(
            (error) =>
               new ResponseData<User[]>(
                  false,
                  null,
                  HttpMessage.INTERNAL_SERVER_ERROR + ` (${error})`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
               ),
         );
   }

   @Get(':id')
   async getUser(@Param('id') id: string): Promise<ResponseData<User>> {
      return this.userService
         .findUserById(id)
         .then((user) => new ResponseData<User>(true, user, HttpMessage.SUCCESS, HttpStatus.SUCCESS))
         .catch(
            (error) => new ResponseData<User>(false, null, HttpMessage.NOT_FOUND + ` (${error})`, HttpStatus.NOT_FOUND),
         );
   }

   @Put(':id')
   async updateUser(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO): Promise<ResponseData<User>> {
      return this.userService
         .updateUser(id, updateUserDTO)
         .then((updatedUser) => new ResponseData<User>(true, updatedUser, HttpMessage.SUCCESS, HttpStatus.SUCCESS))
         .catch(
            (error) =>
               new ResponseData<User>(false, null, HttpMessage.BAD_REQUEST + ` (${error})`, HttpStatus.BAD_REQUEST),
         );
   }
}
