import { PartialType } from "@nestjs/swagger";
import { CreateCinemaResponse } from "./create-cinema-response";

export class UpdateCinemaResponse extends PartialType(CreateCinemaResponse) {}
