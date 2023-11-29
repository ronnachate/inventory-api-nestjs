import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class NewCategoryDTO {

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
}
