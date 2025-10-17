import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./src/user/entity/user.entity";
import { Token } from "./src/user/entity/token.entity";
import { Role } from "./src/user/entity/role.entity";

dotenv.config();

export default new DataSource({
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  migrations: ["migration/**"],
  entities: [User, Token, Role],
});
