import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Screen } from "./screen.entity";

export class Address {
  @Column({ name: "street" })
  street: string;

  @Column({ name: "province" })
  province: string;

  constructor(partial?: Partial<Address>) {
    Object.assign(this, partial);
  }
}

@Entity("cinemas")
export class Cinema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column(() => Address, { prefix: false })
  address: Address;

  @OneToMany(() => Screen, (screen) => screen.cinema)
  screens: Screen[];

  constructor(partial?: Partial<Cinema>) {
    if (partial) {
      Object.assign(this, partial);

      if (partial.address && !(partial.address instanceof Address)) {
        this.address = new Address(partial.address);
      }
    }
  }
}
