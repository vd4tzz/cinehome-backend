import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, RelationId } from "typeorm";
import { User } from "./user.entity";
import { Cinema } from "../../ciname/entity/cinema.entity";

@Entity("user_admin")
export class UserAdmin {
  @PrimaryColumn({ name: "user_id" })
  userId: number;

  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Cinema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @RelationId((entity: UserAdmin) => entity.cinema)
  cinemaId: number;
}
