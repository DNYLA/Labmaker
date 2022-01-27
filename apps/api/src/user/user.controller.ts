import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/Jwt.guard';
import { UserDetails } from '../auth/userDetails.dto';
import { CurrentUser } from '../utils/decorators';
import { AdminUser, UserDto } from './dto/User.dto';
// import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: UserDetails): Promise<UserDto> {
    return this.userService.getUser(user.id);
  }

  @Get('/admin')
  @UseGuards(JwtAuthGuard)
  getAdminUser(@CurrentUser() user: UserDetails): Promise<AdminUser> {
    return this.userService.getAdminUser(user.id);
  }
}
