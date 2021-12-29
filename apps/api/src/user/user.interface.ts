import { UserDetails } from '../auth/userDetails.dto';
import { UserDto } from './dto/User.dto';

export interface IUser {
  getUser(use: UserDetails): Promise<UserDto>;
}
