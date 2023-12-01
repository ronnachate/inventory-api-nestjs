import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { OrderItemDTO } from './order-item/order-item.dto';

export class NewOrderDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  typeId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  orderId: number | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 150)
  tableName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  items: OrderItemDTO[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  discount: number | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(2, 255)
  note: string;
}
