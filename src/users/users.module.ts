import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

// To use DI, we first mark a class as @Injectable,
// and then add the class to the list of providers in the module

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  // providers array is a listing of all different classes that we might
  // want to inject to the DI container
  providers: [UsersService,
              AuthService,],
  controllers: [UsersController],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
      // Apply the middleware fotr all routes
      consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
