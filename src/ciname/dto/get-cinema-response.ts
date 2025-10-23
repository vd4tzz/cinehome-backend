import { PartialType } from "@nestjs/swagger";
import { CreateCinemaResponse } from "./create-cinema-response";

export class GetCinemaResponse extends PartialType(CreateCinemaResponse) {}