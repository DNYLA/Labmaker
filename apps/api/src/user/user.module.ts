import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user.service';

@Module({
  imports: [HttpModule],
  providers: [{ provide: 'USER_SERVICE', useClass: UserService }, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
