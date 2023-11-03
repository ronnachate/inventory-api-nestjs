import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SigninDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  password: string;
}
