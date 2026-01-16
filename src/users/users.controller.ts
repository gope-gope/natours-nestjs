import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';

import { Request } from 'express';

import { UpdateMeDto } from 'src/users/dto/update-me.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers(@Query() params): Promise<User[]> {
    return await this.userService.find(params);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch('/:id')
  async patchUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateOne(id, body);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteOne(id);
  }

  @Patch('/update-my-password')
  async updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto) {
    const { jwt } = req.cookies;
    return await this.userService.updatePassword(body, jwt);
  }

  @Patch('/update-me')
  async updateMe(@Req() req: Request, @Body() body: UpdateMeDto) {
    const { jwt } = req.cookies;
    return await this.userService.updateMe(body, jwt);
  }
}
