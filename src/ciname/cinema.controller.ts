import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { CreateCinemaRequest } from "./dto/create-cinema-request";
import { CreateCinemaResponse } from "./dto/create-cinema-response";
import { CinemaService } from "./cinema.service";
import { UpdateCinemaRequest } from "./dto/update-cinema-request";
import { UpdateCinemaResponse } from "./dto/update-cinema-response";
import { GetCinemaResponse } from "./dto/get-cinema-response";
import { PageParam } from "../common/pagination/PageParam";
import { Page } from "../common/pagination/Page";
import { ApiPaginatedResponse } from "../common/pagination/ApiPaginatedResponse";
import { ApiResponse } from "@nestjs/swagger";

@Controller("api/cinemas")
@UseInterceptors(ClassSerializerInterceptor)
export class CinemaController {
  constructor(private cinemaService: CinemaService) {}

  @Post()
  @ApiResponse({ type: CreateCinemaResponse })
  async createCinema(@Body() createCinemaRequest: CreateCinemaRequest): Promise<CreateCinemaResponse> {
    return this.cinemaService.createCinema(createCinemaRequest);
  }

  @Put(":id")
  async updateCinema(
    @Param("id") id: number,
    @Body() updateCinemaRequest: UpdateCinemaRequest,
  ): Promise<UpdateCinemaResponse> {
    return this.cinemaService.updateCinema(id, updateCinemaRequest);
  }

  @Get(":id")
  @ApiResponse({ type: GetCinemaResponse })
  async getCinemaById(@Param("id") id: number): Promise<GetCinemaResponse> {
    return await this.cinemaService.getCinemaById(id);
  }

  @Get()
  @ApiPaginatedResponse(GetCinemaResponse)
  async getCinemas(@Query() pageParam: PageParam): Promise<Page<GetCinemaResponse>> {
    return this.cinemaService.getCinemas(pageParam);
  }

  // Todo deleteCinema
}
