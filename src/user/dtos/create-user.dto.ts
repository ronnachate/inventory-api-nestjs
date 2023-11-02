import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsAlphanumeric, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ROLE } from '../../auth/constant/role.enum';

export class CreateUserDTO {

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(2, 50)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(2, 100)
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(2, 50)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiProperty({ example: [ROLE.USER] })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ROLE, { each: true })
  roles: ROLE[];

}
