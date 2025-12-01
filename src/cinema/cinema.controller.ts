import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CreateCinemaRequest } from "./dto/create-cinema-request";
import { CreateCinemaResponse } from "./dto/create-cinema-response";
import { CinemaService } from "./cinema.service";
import { UpdateCinemaRequest } from "./dto/update-cinema-request";
import { UpdateCinemaResponse } from "./dto/update-cinema-response";
import { GetCinemaResponse } from "./dto/get-cinema-response";
import { PageQuery } from "../common/pagination/page-query";
import { Page } from "../common/pagination/page";
import { ApiPaginatedResponse } from "../common/pagination/ApiPaginatedResponse";
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RoleName } from "../user/entity/role.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateScreenRequest } from "./dto/create-screen-request";
import { CreateScreenResponse } from "./dto/create-screen-response";
import { ScreenService } from "./screen.service";
import { UpdateScreenRequest } from "./dto/update-screen-request";
import { UpdateScreenResponse } from "./dto/update-screen-response";
import { GetScreenResponse } from "./dto/get-screen-response";

@ApiBearerAuth("access-token")
@Controller("api/cinemas")
@UseInterceptors(ClassSerializerInterceptor)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CinemaController {
  constructor(
    private cinemaService: CinemaService,
    private screenService: ScreenService,
  ) {}

  @ApiResponse({ type: CreateCinemaResponse, status: 201 })
  @Post()
  @Roles(RoleName.SUPER_ADMIN)
  async createCinema(@Body() createCinemaRequest: CreateCinemaRequest): Promise<CreateCinemaResponse> {
    return this.cinemaService.createCinema(createCinemaRequest);
  }

  @Get("provinces")
  async getCinemaProvinces() {
    return this.cinemaService.getCinemaProvinces();
  }

  @ApiOkResponse({ type: UpdateCinemaResponse })
  @Put(":cinemaId")
  @Roles(RoleName.SUPER_ADMIN)
  async updateCinema(
    @Param("cinemaId") cinemaId: number,
    @Body() updateCinemaRequest: UpdateCinemaRequest,
  ): Promise<UpdateCinemaResponse> {
    return this.cinemaService.updateCinema(cinemaId, updateCinemaRequest);
  }

  @ApiOkResponse({ type: GetCinemaResponse })
  @Get(":cinemaId")
  async getCinemaById(@Param("cinemaId", ParseIntPipe) cinemaId: number): Promise<GetCinemaResponse> {
    return await this.cinemaService.getCinemaById(cinemaId);
  }

  @ApiPaginatedResponse(GetCinemaResponse)
  @Get()
  async getCinemas(@Query() pageParam: PageQuery): Promise<Page<GetCinemaResponse>> {
    return this.cinemaService.getCinemas(pageParam);
  }

  @Delete(":cinemaId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCinemaById(@Param("cinemaId") cinemaId: number): Promise<void> {
    await this.cinemaService.deleteCinemaById(cinemaId);
  }

  @Post(":cinemaId/screens")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateScreenResponse })
  async createScreen(
    @Param("cinemaId") cinemaId: number,
    @Body() createScreenRequest: CreateScreenRequest,
  ): Promise<CreateScreenResponse> {
    return this.screenService.createScreen(cinemaId, createScreenRequest);
  }

  @Get(":cinemaId/screens")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiPaginatedResponse(GetScreenResponse)
  async getScreens(@Param("cinemaId") cinemaId: number, @Query() pageQuery: PageQuery) {
    return this.screenService.getScreens(cinemaId, pageQuery);
  }
}
