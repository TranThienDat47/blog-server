declare const module: any;
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
   const app = await NestFactory.create(AppModule, {
      rawBody: true,
      cors: true,
      bodyParser: true,
   });
   app.useGlobalPipes(new ValidationPipe());

   await app.listen(9000);

   if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
   }
}
bootstrap();
