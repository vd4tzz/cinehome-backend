import { PageParam } from "../../../common/pagination/page-param";
import { ShowtimeState } from "../../../cinema/entity/showtime.entity";

export class ShowtimeQuery extends PageParam {
  startTimeFrom: string;
  startTimeTo: string;
  state: ShowtimeState;
}
