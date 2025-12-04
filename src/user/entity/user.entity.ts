import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @Column({ name: "full_name", type: "varchar", length: 255, nullable: true })
  fullName: string;

  @Column({ name: "date_of_birth", type: "date", nullable: true })
  dateOfBirth: Date;

  @Column({ name: "phone_number", type: "varchar", length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: "varchar", length: 255, unique: true })
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

  @OneToOne(() => UserAdmin, (admin) => admin.user)
  admin: UserAdmin;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
