import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ErrorCode } from "./common/exceptions";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });
  app.use(cookieParser());

  app.enableCors({
    origin: ["http://localhost:5173", "https://cinehome-frontend-six.vercel.app"],
    credentials: true, // Cho phép gửi cookie/token qua
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

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
    .setTitle("CineHome")
    .setDescription("The CineHome API description")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
      },
      "access-token",
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.log("Have problems when bootstrapping:", err);
});
