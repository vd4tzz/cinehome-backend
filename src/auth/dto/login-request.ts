import { ApiProperty } from "@nestjs/swagger";

export class LoginRequest {
  @ApiProperty({ example: "" })
  public email: string;

  @ApiProperty({ example: "" })
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
