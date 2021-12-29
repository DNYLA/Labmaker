import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/Jwt.guard';
import { UserDetails } from '../auth/userDetails.dto';
import { CurrentUser } from '../utils/getUser.decorator';
import { UserDto } from './dto/User.dto';
import { IUser } from './user.interface';

@Controller('user')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly userService: IUser) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: UserDetails): Promise<UserDto> {
    return this.userService.getUser(user);
  }
}
