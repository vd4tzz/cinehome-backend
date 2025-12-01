import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PageQuery {
  private sortByValidated: boolean = false;
  static DEFAULT_PAGE_NUMBER: number = 0;
  static DEFAULT_SIZE_NUMBER: number = 10;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 0))
  page: number = PageQuery.DEFAULT_PAGE_NUMBER;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  size: number = PageQuery.DEFAULT_SIZE_NUMBER;

  // @ApiPropertyOptional({ type: String })
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

  // @ApiPropertyOptional({ type: String })
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

  get order(): Record<string, "ASC" | "DESC"> {
    const order: Record<string, "ASC" | "DESC"> = {};
    this.sortBy?.forEach((field, i) => {
      order[field] = this.sortDir?.[i]?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    });
    return order;
  }

  get skip(): number {
    return this.page * this.size;
  }

  validateSortBy(allowedSortFields: string[]): PageQuery {
    const valid = new PageQuery();
    valid.page = this.page;
    valid.size = this.size;
    valid.sortDir = this.sortDir;

    if (allowedSortFields === undefined || allowedSortFields.length === 0) {
      valid.sortBy = this.sortBy;
    } else {
      valid.sortBy = this.sortBy.filter((f) => allowedSortFields.includes(f));
    }

    valid.sortByValidated = true;

    return valid;
  }

  get isSortByValidated(): boolean {
    return this.sortByValidated;
  }
}
