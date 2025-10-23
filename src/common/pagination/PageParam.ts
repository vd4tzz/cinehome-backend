import { Expose, Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PageParam {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 0))
  page: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  size: number;

  @ApiPropertyOptional({ type: String })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v));
    } else if (typeof value === "string") {
      return value.split(",").map((v) => v.trim());
    } else {
      return [];
    }
  })
  private sortBy: string[];

  @ApiPropertyOptional({ type: String })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v));
    } else if (typeof value === "string") {
      return value.split(",").map((v) => v.trim());
    } else {
      return [];
    }
  })
  private sortDir: string[];

  @Expose()
  get order(): Record<string, "ASC" | "DESC"> {
    const order: Record<string, "ASC" | "DESC"> = {};
    this.sortBy?.forEach((field, i) => {
      order[field] = this.sortDir?.[i]?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    });
    return order;
  }
}
