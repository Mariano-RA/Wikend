/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

async function bootstrap() {
  config.update({
    accessKeyId: 'AKIAY3PLHSUJCRZJEG6D',
    secretAccessKey: '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',
    region: 'sa-east-1',
  });

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3030);
}
bootstrap();
