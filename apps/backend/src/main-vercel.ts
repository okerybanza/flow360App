import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable CORS for Vercel
  app.enableCors({
    origin: [
      'https://360flow-app-frontend.vercel.app',
      'https://360flow-app-frontend-okerybanza-gmailcoms-projects.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('360Flow API')
    .setDescription('API pour la plateforme de gestion de projets 360Flow')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // For Vercel, we don't need to listen on a port
  // The handler will be exported
  await app.init();
  
  return app;
}

// Export the handler for Vercel
export default bootstrap().then(app => app.getHttpAdapter().getInstance());
