import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ScreenService } from "./screen.service";
import { CreateScreenRequest } from "./dto/create-screen-request";
import { CreateScreenResponse } from "./dto/create-screen-response";
import { UpdateScreenRequest } from "./dto/update-screen-request";
import { UpdateScreenResponse } from "./dto/update-screen-response";
import { PageParam } from "../common/pagination/page-param";
import { RolesGuard } from "../auth/roles.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RoleName } from "../user/entity/role.entity";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth("access-token")
@Controller("api/cinemas/:cinemaId/screens")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScreenController {
  constructor(private screenService: ScreenService) {}

}
