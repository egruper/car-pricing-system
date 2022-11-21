import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { UsersService } from './users.service'; 
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => { 
        return Promise.resolve({id, email: 'test@gmail.com', password: 'pass' } as User);
      },
      find: () => {
        return Promise.resolve([{id: 1, email: 'test@test.com', password: 'password'} as User]);
      },
      //remove: () => {},
      //update: () => {}
    };
    fakeAuthService = {
      // signUp: () => {},
       signIn: (email: string, password: string) => {
          return Promise.resolve({id: 789, email, password } as User);
       },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });
 
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

   // We do not test the Decorators of this function (findAllUsers), but only the function itself.
   // In order to test the decorators we do th end-to-end test on the request.http file
   it('findAllUsers returns a list of users with the given email', async () => {
      const users = await controller.findAllUsers('test@test.com');
      expect(users.length).toEqual(1);
      expect(users[0].email).toEqual('test@test.com');
   });

   it('findUser returns a single user with a given id', async () => {
      const user = await controller.findUser('1');
      expect(user).toBeDefined();
   })

   it('findUser throws an error if a user with given id os not found', async () => {
      fakeUsersService.findOne = () => null
      await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
   });

   it('signin updates session pbject and returns user', async () => {
      const session = { userId: 222 };    const user = await controller.signIn( 
        { email: 'test@test.com', password: 'password '},
        session
      );
    
      expect(user.id).toEqual(789);
      expect(session.userId).toEqual(789);
   });

   it('signOut updates the session.userId to null', async () => {
       const session = { userId: 222 };
       controller.signOut(session);

       expect(session.userId).toEqual(null);
   });

});
