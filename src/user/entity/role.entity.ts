import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum RoleName {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
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
