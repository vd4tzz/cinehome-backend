import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

export enum OAuth2Provider {
  GOOGLE = "GOOGLE",
  NONE = "NONE",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  password: string;

  @Column({ name: "is_verified", type: "boolean" })
  isVerified: boolean;

  @Column({ type: "enum", enum: OAuth2Provider, name: "o_auth2_provider" })
  oAuth2Provider: OAuth2Provider;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: "user_role",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
  })
  roles: Role[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
