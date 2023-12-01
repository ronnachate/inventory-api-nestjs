import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemOptionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  optionId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  selectionId: number;
}
