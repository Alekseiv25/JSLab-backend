/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
const cookieParser = require('cookie-parser');

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(
    cookieParser(null, {
      credentials: true,
    }),
  );

  await app.listen(PORT, () => console.log(`JSLab-backend server started on port ${PORT}`));
}

start();
