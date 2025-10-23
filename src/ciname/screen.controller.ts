import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ScreenService } from "./screen.service";
import { CreateScreenRequest } from "./dto/create-screen-request";
import { CreateScreenResponse } from "./dto/create-screen-response";
import { UpdateScreenRequest } from "./dto/update-screen-request";
import { UpdateScreenResponse } from "./dto/update-screen-response";
import { PageParam } from "../common/pagination/PageParam";

@Controller("api/cinemas/:cinemaId/screens")
export class ScreenController {
  constructor(private screenService: ScreenService) {}

  @Post()
  async createScreen(
    @Param("cinemaId") cinemaId: number,
    @Body() createScreenRequest: CreateScreenRequest,
  ): Promise<CreateScreenResponse> {
    return this.screenService.createScreen(cinemaId, createScreenRequest);
  }

  @Put(":screenId")
  async updateScreen(
    @Param("cinemaId") cinemaId: number,
    @Param("screenId") screenId: number,
    @Body() updateScreenRequest: UpdateScreenRequest,
  ): Promise<UpdateScreenResponse> {
    return this.screenService.updateScreen(cinemaId, screenId, updateScreenRequest);
  }

  @Get(":screenId")
  async getScreenById(@Param("screenId") screenId: number) {
    return this.screenService.getScreenById(screenId);
  }

  @Get()
  async getScreens(@Param("cinemaId") cinemaId: number, @Query() pageParam: PageParam) {
    return this.screenService.getScreens(cinemaId, pageParam);
  }
}
