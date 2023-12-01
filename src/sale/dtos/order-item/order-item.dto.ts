import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { OrderItemOptionDTO } from './order-item-option.dto';
import { OrderItemAddonDTO } from './order-item-addon.dto';

export class OrderItemDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  typeId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  productId: number | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  options: OrderItemOptionDTO[] | null;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  addons: OrderItemAddonDTO[] | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(2, 255)
  note: string;
}
