import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum TokenType {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

@Entity("tokens")
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  token: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "enum", enum: TokenType })
  type: TokenType;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  constructor(partial: Partial<Token>) {
    Object.assign(this, partial);
  }
}
