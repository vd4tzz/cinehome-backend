import { ApiProperty } from "@nestjs/swagger";

export class SendEmailResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  email: string;

  constructor(partial: Partial<SendEmailResponse>) {
    Object.assign(this, partial);
  }
}
