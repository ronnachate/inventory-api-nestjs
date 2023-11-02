import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { USER_DISABLED_STATUS } from '../../shared/constant/generic';
import { LoginUserDTO } from '../dtos/login.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<LoginUserDTO> {

    const user = await this.userService.validateLoginUser(
      username,
      pass,
    );

    // Prevent disabled users from logging in.
    if (user.status.id === USER_DISABLED_STATUS) {
      throw new UnauthorizedException('This user account has been disabled');
    }

    return user;
  }
}
