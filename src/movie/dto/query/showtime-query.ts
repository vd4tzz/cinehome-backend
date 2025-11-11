import { PageQuery } from "../../../common/pagination/page-query";
import { ShowtimeState } from "../../../cinema/entity/showtime.entity";

export class ShowtimeQuery extends PageQuery {
  startTimeFrom: string;
  startTimeTo: string;
  state: ShowtimeState;
}
