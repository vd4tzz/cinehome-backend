import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.init();
  }

  async init() {
    const sqlScript = fs.readFileSync("src/common/seed/sql-script/init.sql", "utf-8");
    await this.dataSource.query(sqlScript);
  }
}
