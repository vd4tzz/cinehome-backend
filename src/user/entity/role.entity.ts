import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum RoleName {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: RoleName })
  name: RoleName;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }
}
