import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());  
//   app.enableCors({
//     origin: 'https://62efe527ac35f83484d93ae8--tiny-gumdrop-cc6f73.netlify.app',
//     credentials: true
// });

app.enableCors({
  origin: [    
    'http://localhost:3000',
    'https://skylabel.netlify.app',
    'http://www.himyone.herokuapp.com',
    'http://app.himyone.herokuapp.com',
    'https://himyone.herokuapp.com',
    'https://www.himyone.herokuapp.com',
    'https://app.himyone.herokuapp.com',
    'https://sevenstar-gazi.netlify.app',
    'https://somak-gazi-dev.netlify.app',
    'https://62f121ef8fac9d14a6d76fc5--sevenstar-gazi.netlify.app'
    
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'X-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
  credentials: true
});
  // await app.listen(process.env.PORT || 3000);
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
