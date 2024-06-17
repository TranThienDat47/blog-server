import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '~schemas/user.schema';
import { CreateUserDTO } from '~dto/users/createUserDTO';
import { LoginUserDTO } from '~dto/users/loginUserDTO';
import { UpdateUserDTO } from '~dto/users/updateUserDTO';

@Injectable()
export class UserService {
   constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

   async createUser(createUserDTO: CreateUserDTO): Promise<User> {
      return this.userModel
         .findOne({ email: createUserDTO.email })
         .exec()
         .then((existingUser) => {
            if (existingUser) {
               throw new ConflictException('Email already exists');
            }

            const saltRounds = 10;
            return bcrypt.hash(createUserDTO.password, saltRounds);
         })
         .then((hashedPassword) => {
            const createdUser = new this.userModel({
               ...createUserDTO,
               password: hashedPassword,
            });
            return createdUser.save();
         });
   }

   async findUserByEmail(email: string): Promise<User | null> {
      return this.userModel.findOne({ email }).exec();
   }

   async findUserById(id: string): Promise<User | null> {
      return this.userModel.findById(id).exec();
   }

   async findUsers(skip: number = 0, limit: number = 10, key: string = '', sort: number = 1): Promise<User[]> {
      const query = key
         ? {
              $or: [
                 { firstName: { $regex: key, $options: 'i' } },
                 { lastName: { $regex: key, $options: 'i' } },
                 { email: { $regex: key, $options: 'i' } },
              ],
           }
         : {};

      const sortOption = { createdAt: sort as 1 | -1 };

      return this.userModel.find(query).sort(sortOption).skip(skip).limit(limit).exec();
   }

   async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
      const updatePasswordPromise = updateUserDTO.password
         ? bcrypt.hash(updateUserDTO.password, 10).then((hashedPassword) => {
              updateUserDTO.password = hashedPassword;
           })
         : Promise.resolve();

      return updatePasswordPromise.then(() =>
         this.userModel.findByIdAndUpdate(id, updateUserDTO, { new: true }).exec(),
      );
   }

   async deleteUser(id: string): Promise<User> {
      return this.userModel.findByIdAndDelete(id).exec();
   }
}
