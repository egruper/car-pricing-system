import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
//import { User } from './users/user.entity';
//import { Report } from './reports/report.entity';
import { TypeOrmConfigService } from './config/typeorm.config'
// Not importing 'cookie-session' due to a mismatch with the tsconfig and this library
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: `.env.${process.env.NODE_ENV}`
    }),
	TypeOrmModule.forRootAsync({
		useClass: TypeOrmConfigService,
	}),
    UsersModule,
    ReportsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // Using whitelist for security 
        // to not let users add additoinal properties,
        // other then email + password
        whitelist: true,
      })
    }],
})

export class AppModule {
	constructor(
		private configService: ConfigService
	) {}
	// Will be called automatically when the application starts listens to incoming traffic.
	// The middleware will run on every incoming request
	// We do this so our end-to-end test will be able to access cookie-session
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(
			cookieSession({
			// The keys array is being used to encrypt the cookie
			keys: [this.configService.get('COOKIE_KEY')],})
		).forRoutes('*')
		// 'forRoutes('*') means we want to use this middleware on all incoming requests on the application,
		// making it a global middleware.
	}
}
