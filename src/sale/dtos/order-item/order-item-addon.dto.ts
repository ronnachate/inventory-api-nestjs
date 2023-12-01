import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber} from 'class-validator';

export class OrderItemAddonDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  addonId: number;
}
