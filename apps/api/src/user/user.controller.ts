import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/Jwt.guard';
import { UserDetails } from '../utils/types';
import { CurrentUser } from '../utils/decorators';
import { AdminUser, UserDto } from '../utils/types';
import { ClientApplications } from '@prisma/client';
import { CreateClient, UpdateClient } from './client.dto';
// import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  getUser(
    @Query() admin: boolean,
    @CurrentUser() user: UserDetails
  ): Promise<UserDto | AdminUser> {
    if (!admin) {
      return this.userService.getUser(user.id);
    }

    return this.userService.getAdminUser(user.id);
  }

  @Get('/admin')
  @UseGuards(JwtAuthGuard)
  getAdminUser(@CurrentUser() user: UserDetails): Promise<AdminUser> {
    return this.userService.getAdminUser(user.id);
  }

  @Get('clients')
  @UseGuards(JwtAuthGuard)
  getClients(@CurrentUser() user: UserDetails): Promise<ClientApplications[]> {
    return this.userService.getClients(user);
  }

  @Post('clients')
  @UseGuards(JwtAuthGuard)
  createClient(
    @Body() client: CreateClient,
    @CurrentUser() user: UserDetails
  ): Promise<ClientApplications> {
    return this.userService.createClient(client, user);
  }

  @Put('clients')
  @UseGuards(JwtAuthGuard)
  updateClient(
    @Body() client: UpdateClient,
    @CurrentUser() user: UserDetails
  ): Promise<ClientApplications> {
    return this.userService.updateClient(client, user);
  }
}
