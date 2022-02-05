import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enable('trust proxy');
  app.enableCors({
    origin: [process.env.ADMIN_DASH_URL, process.env.USER_DASH_URL],
    credentials: true,
  });

  app.use(helmet()); //HELMET MUST COME FIRST
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(passport.initialize());
  app.use(compression());

  await app.listen(process.env.PORT || 3000);
  Logger.log(
    `Launched in ${process.env.ENVIRONMENT || 'DEV'} on ${await app.getUrl()}`,
    'Main'
  );
}

bootstrap();
