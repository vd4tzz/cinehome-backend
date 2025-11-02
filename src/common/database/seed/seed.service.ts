import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.init();
  }

  async init() {
    const filePath = path.join(__dirname, "./sql-script/init.sql");
    const sqlScript = fs.readFileSync(filePath, "utf-8");
    await this.dataSource.query(sqlScript);
  }
}
