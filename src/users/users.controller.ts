import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Headers,
  UseGuards,
  SetMetadata,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { Model } from 'mongoose';

import { UsersService } from '@messanger/src/users/users.service';
import { HashService } from '@messanger/src/hash/hash.service';
import { ImageService } from '@messanger/src/image/image.service';
import { RoleGuard } from '@messanger/src/role.guard';
import { SelfGuard } from '@messanger/src/self.guard';
import { CreateUserDto, LoginUserDto, EditUserDto } from '@messanger/dtos';
import { IUser } from '@messanger/interfaces';

@Controller('users')
export class UsersController {

  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private imageService: ImageService
  ) { }

  @Get()
  async findAll(): Promise<IUser[]> {
    return await this.usersService.all();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Model<IUser>> {
    const existUser = await this.usersService.findOneBy({ personalId: createUserDto.personalId });

    if (existUser) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorMessage: 'The login is already exists'
      });
    }

    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<Model<IUser>> {
    const userModel = await this.usersService.findByLoginAndPassword(loginUserDto);

    if (userModel) {
      const newRoles = userModel.roles.includes('authorized') ? userModel.roles : userModel.roles.concat('authorized')

      const loginedUser = await this.usersService.updateModel(userModel, {
        apiKey: this.hashService.getRandomHash(),
        roles: newRoles
      });

      if (loginedUser.avatar) {
        loginedUser.avatar = this.imageService.getImage(loginedUser.avatar);
      }

      return loginedUser;
    }

    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      errorMessage: 'Wrong login or password'
    });
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Get('logout')
  async logout(@Headers('authorization') apiKey: string): Promise<boolean> {
    const userModel = await this.usersService.findOneBy({ apiKey: apiKey.substr(7) });

    if (userModel) {
      this.usersService.updateModel(userModel, {
        apiKey: null,
        roles: userModel.roles.filter(role => role != 'authorized')
      });
      return true;
    }

    return false;
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Get('loginByApiKey')
  async findByApiKey(@Headers('authorization') apiKey: string): Promise<Model<IUser>> {
    const user = await this.usersService.findOneBy({ apiKey: apiKey.substr(7) });
    
    if (user.avatar) {
      user.avatar = this.imageService.getImage(user.avatar);
    }

    return user;
  }

  @UseGuards(SelfGuard, RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Put(':id')
  async editUser(@Body() editUserDto: EditUserDto, @Param('id') id: string): Promise<Model<IUser>> {
    const user = await this.usersService.findById(id);

    if (editUserDto.avatar) {
      if (user.avatar) {
        this.imageService.removeImage(user.avatar);
      }

      const filename = this.hashService.getRandomHash() + '.' + this.imageService.getImageExtension(editUserDto.avatar);

      this.imageService.saveImage(editUserDto.avatar, filename);
      editUserDto.avatar = filename;
    } else if (editUserDto.avatar === null) {
      this.imageService.removeImage(user.avatar);
    }

    const updatedUser = await this.usersService.updateModel(user, editUserDto);
    
    if (updatedUser.avatar) {
      updatedUser.avatar = this.imageService.getImage(updatedUser.avatar);
    }

    return updatedUser;
  }

  @UseGuards(SelfGuard, RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Post('password/:id')
  async checkPassword(@Body() body: { password: string }, @Param('id') id: string): Promise<boolean> {
    const user = await this.usersService.findById(id);

    if (user.password === body.password) {
      return true;
    }

    return false;
  }
}
