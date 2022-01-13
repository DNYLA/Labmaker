import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/Jwt.guard';
import { UserDetails } from '../auth/userDetails.dto';
import { CurrentUser } from '../utils/decorators';
import { UserDto } from './dto/User.dto';
// import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: UserDetails): Promise<UserDto> {
    return this.userService.getUser(user);
  }
}
