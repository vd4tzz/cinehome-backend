import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerification(emailTo: string, verificationLink: string, expirationTime: number) {
    await this.mailerService.sendMail({
      to: emailTo,
      subject: "Xac nhan tai khoan",
      template: "./confirmation",
      context: {
        verificationLink,
        expirationTime,
      },
    });
  }

  async sendForgotPassword(emailTo: string, forgotPasswordLink: string, expirationTime: number) {
    await this.mailerService.sendMail({
      to: emailTo,
      subject: "Đặt lại mật khẩu",
      template: "./forgot-password",
      context: {
        forgotPasswordLink,
        expirationTime,
      },
    });
  }
}
