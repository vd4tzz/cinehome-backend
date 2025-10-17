import { ApiProperty } from "@nestjs/swagger";

export class LoginRequest {
  @ApiProperty({ example: "nguyenandduy@gmail.com" })
  public email: string;

  @ApiProperty({ example: "12345678a" })
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
