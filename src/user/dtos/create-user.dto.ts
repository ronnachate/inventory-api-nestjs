import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDTO {

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(2, 50)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty()
  @IsOptional()
  @Length(2, 100)
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(2, 50)
  username: string;
}
