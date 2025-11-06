import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class SignupResponse {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  constructor(partial: Partial<SignupResponse>) {
    Object.assign(this, partial);
  }
}
