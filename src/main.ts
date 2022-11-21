import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Removing the coockie session from heere so the e2e tests will have access to it.
  // See app.module.ts file
  //app.use(cookieSession({
  //    The keys array is being used to encrypt the cookie
  //   keys: ['justrandomletters'],
  // }));
  app.useGlobalPipes();
  await app.listen(3000);
}
bootstrap();
