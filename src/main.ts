import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ErrorCode } from "./common/exceptions";
import { SeedService } from "./common/seed/seed.service";
import  cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = {};
        errors.forEach((err) => {
          result[err.property] = Object.values(err.constraints ?? {})[0];
        });
        return new BadRequestException({
          errors: result,
          message: "invalid format",
          code: ErrorCode.INVALID_FORMAT,
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("cats")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  // const seedService = app.get(SeedService);
  // await seedService.init();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.log("Have problems when bootstrapping:", err);
});
