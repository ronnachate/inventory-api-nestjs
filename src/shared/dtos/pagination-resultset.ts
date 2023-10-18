import { ApiProperty } from "@nestjs/swagger";

export class PaginationResultset<T> {
  @ApiProperty()
  public items: T;

  @ApiProperty()
  public pagination: any;
}
