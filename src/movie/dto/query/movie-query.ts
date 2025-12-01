import { PageQuery } from "../../../common/pagination/page-query";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class MovieQuery extends PageQuery {
  @ApiPropertyOptional()
  title: string;
}
