import { INestApplication, Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  private app: INestApplication;
  setApp(app: INestApplication) {
    this.app = app;
  }
  getApp(): INestApplication {
    return this.app;
  }

  getHello(): string {
    return "Hello World!";
  }
}
