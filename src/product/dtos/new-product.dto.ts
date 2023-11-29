import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ROLE } from '../../auth/constant/role.enum';

export class NewProductDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 150)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(2, 255)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

}
