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
import { PageParam } from "../common/pagination/PageParam";
import { Page } from "../common/pagination/Page";
import { ApiPaginatedResponse } from "../common/pagination/ApiPaginatedResponse";
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RoleName } from "../user/entity/role.entity";
import { CinemaOwnershipGuard } from "./cinema-ownership.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CheckCinemaOwnership } from "./check-cinema-ownership.decorator";

@ApiBearerAuth("access-token")
@Controller("api/cinemas")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard, CinemaOwnershipGuard)
export class CinemaController {
  constructor(private cinemaService: CinemaService) {}

  @ApiResponse({ type: CreateCinemaResponse, status: 201 })
  @Post()
  @Roles(RoleName.SUPER_ADMIN)
  @CheckCinemaOwnership(false)
  async createCinema(@Body() createCinemaRequest: CreateCinemaRequest): Promise<CreateCinemaResponse> {
    return this.cinemaService.createCinema(createCinemaRequest);
  }

  @ApiOkResponse({ type: UpdateCinemaResponse })
  @Put(":cinemaId")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
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
}
