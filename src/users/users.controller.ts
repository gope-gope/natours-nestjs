import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

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
}
