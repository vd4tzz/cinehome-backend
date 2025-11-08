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
import { PageParam } from "../common/pagination/page-param";
import { Page } from "../common/pagination/page";
import { ApiPaginatedResponse } from "../common/pagination/ApiPaginatedResponse";
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RoleName } from "../user/entity/role.entity";
import { CinemaOwnershipGuard } from "../auth/cinema-ownership.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CinemaOwnership } from "../auth/cinema-ownership.decorator";
import { CreateScreenRequest } from "./dto/create-screen-request";
import { CreateScreenResponse } from "./dto/create-screen-response";
import { ScreenService } from "./screen.service";
import { UpdateScreenRequest } from "./dto/update-screen-request";
import { UpdateScreenResponse } from "./dto/update-screen-response";

@ApiBearerAuth("access-token")
@Controller("api/cinemas")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard, CinemaOwnershipGuard)
export class CinemaController {
  constructor(
    private cinemaService: CinemaService,
    private screenService: ScreenService,
  ) {}

  @ApiResponse({ type: CreateCinemaResponse, status: 201 })
  @Post()
  @Roles(RoleName.SUPER_ADMIN)
  @CinemaOwnership(false)
  async createCinema(@Body() createCinemaRequest: CreateCinemaRequest): Promise<CreateCinemaResponse> {
    return this.cinemaService.createCinema(createCinemaRequest);
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
  async getCinemas(@Query() pageParam: PageParam): Promise<Page<GetCinemaResponse>> {
    return this.cinemaService.getCinemas(pageParam);
  }

  @Delete(":cinemaId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCinemaById(@Param("cinemaId") cinemaId: number): Promise<void> {
    await this.cinemaService.deleteCinemaById(cinemaId);
  }

  @Post(":cinemaId/screens")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  async createScreen(
    @Param("cinemaId") cinemaId: number,
    @Body() createScreenRequest: CreateScreenRequest,
  ): Promise<CreateScreenResponse> {
    return this.screenService.createScreen(cinemaId, createScreenRequest);
  }

  @Put(":cinemaId/screens/:screenId")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  async updateScreen(
    @Param("cinemaId") cinemaId: number,
    @Param("screenId") screenId: number,
    @Body() updateScreenRequest: UpdateScreenRequest,
  ): Promise<UpdateScreenResponse> {
    return this.screenService.updateScreen(cinemaId, screenId, updateScreenRequest);
  }

  @Get(":cinemaId/screens/:screenId")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  async getScreenById(@Param("screenId") screenId: number) {
    return this.screenService.getScreenById(screenId);
  }

  @Get(":cinemaId/screens")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  async getScreens(@Param("cinemaId") cinemaId: number, @Query() pageParam: PageParam) {
    return this.screenService.getScreens(cinemaId, pageParam);
  }

  @Delete(":cinemaId/screens/:screenId")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  async deleteScreen(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Param("screenId", ParseIntPipe) screenId: number,
  ): Promise<void> {
    return this.screenService.deleteScreen(cinemaId, screenId);
  }
}
