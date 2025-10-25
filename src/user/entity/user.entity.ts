import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Role } from "./role.entity";
import { UserAdmin } from "./user-admin.entity";

export enum OAuth2Provider {
  GOOGLE = "GOOGLE",
  NONE = "NONE",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
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

  @OneToOne(() => UserAdmin, (admin) => admin.user)
  admin: UserAdmin;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
