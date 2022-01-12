import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [
    { provide: 'USER_SERVICE', useClass: UserService },
    UserService,
    UserGateway,
  ],
  controllers: [UserController],
  exports: [UserService, UserGateway],
})
export class UserModule {}
