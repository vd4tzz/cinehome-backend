import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, transform:true
  }));

   // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('🎬 Cinema Booking API')
    .setDescription('API documentation for Cinema Booking system (NestJS + PostgreSQL)')
    .setVersion('1.0.0')
    .addBearerAuth() // Thêm nút nhập JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // route: /docs

  console.log('API docs available at /docs');
  // Các cấu hình khác của bạn...
  app.enableCors();  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
