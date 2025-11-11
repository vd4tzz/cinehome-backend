import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PageQuery } from "./page-query";
import { Request } from "express";

export const PageQuery = (...allowedSortFields: string[]) => {
  return createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const pageParam = plainToInstance(PageQuery, request.query);
    return pageParam.validateSortBy(allowedSortFields);
  })();
};
