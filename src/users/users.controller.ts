import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { DeleteResult } from 'mongoose';

import { Request } from 'express';

import { ProtectGuard } from 'src/common/guards/protect-guard';
import { UpdateMeDto } from 'src/users/dto/update-me.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch('/update-me')
  @UseGuards(ProtectGuard)
  async updateMe(@Req() req: Request, @Body() body: UpdateMeDto) {
    const { jwt } = req.cookies;
    return await this.userService.updateMe(body, jwt);
  }

  @Patch('/update-my-password')
  @UseGuards(ProtectGuard)
  async updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto) {
    const { jwt } = req.cookies;
    return await this.userService.updatePassword(body, jwt);
  }

  @Get()
  async getUsers(@Query() params): Promise<UserDto[]> {
    const userDocs = await this.userService.find(params);
    return plainToInstance(UserDto, userDocs, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<UserDto> {
    const userDoc = await this.userService.findOne(id);
    return plainToInstance(UserDto, userDoc, { excludeExtraneousValues: true });
  }

  // TODO :: ADMIN ONLY
  @Patch('/:id')
  @UseGuards(ProtectGuard)
  async patchUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    const userDoc = await this.userService.updateOne(id, body);
    return plainToInstance(UserDto, userDoc, { excludeExtraneousValues: true });
  }

  // TODO :: ADMIN ONLY
  @Delete('/:id')
  @UseGuards(ProtectGuard)
  async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.deleteOne(id);
  }
}
