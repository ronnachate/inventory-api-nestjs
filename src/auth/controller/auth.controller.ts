import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { SigninDTO } from '../dtos/signin.dto';
import { AuthTokenDTO } from '../dtos/auth-token.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthTokenDTO,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async signin(@Body() credential: SigninDTO): Promise<AuthTokenDTO> {
    const authToken = await this.authService.signIn(credential);
    return authToken;
  }
}
