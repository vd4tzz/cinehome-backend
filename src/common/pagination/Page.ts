import { PageParam } from "./PageParam";
import { ApiProperty } from "@nestjs/swagger";

class PageMetadata {
  @ApiProperty()
  readonly totalItem: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly size: number;

  @ApiProperty()
  readonly totalPage: number;

  @ApiProperty()
  readonly hasNext: boolean;

  @ApiProperty()
  readonly hasPrevious: boolean;

  @ApiProperty()
  readonly isFirst: boolean;

  @ApiProperty()
  readonly isLast: boolean;
}

export class Page<T> {
  @ApiProperty({
    isArray: true,
  })
  readonly data: T[];

  @ApiProperty({
    type: () => PageMetadata,
  })
  readonly metadata: PageMetadata;

  constructor(data: T[], pageParam: PageParam, totalItem: number) {
    const { page, size } = pageParam;
    const totalPage = Math.ceil(totalItem / size);

    this.data = data;
    this.metadata = {
      totalItem,
      page,
      size,
      totalPage,
      hasNext: page + 1 < totalPage,
      hasPrevious: page > 0,
      isFirst: page === 0,
      isLast: page + 1 === totalPage,
    };
  }
}
