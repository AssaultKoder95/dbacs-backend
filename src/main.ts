import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(AppLogger);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.useLogger(logger);

  const config = new DocumentBuilder()
    .setTitle('DBACS')
    .setDescription('DBACS Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
