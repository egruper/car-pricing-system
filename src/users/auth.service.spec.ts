import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService; 
    let fakeUsersService: Partial<UsersService> ;

    beforeEach(async () =>  {
        const users: User[] = [];

        // Create a fake copy of user service
        // We replace only 'find'+'create' functions (and not 'findOne' etc.)
        // since AuthService only make user of find+create of UsersService.
        fakeUsersService = {
            // Fake 'find' function to replace the 'find' function of the real UsersService
            find: (email:string) => {
                const filteredUsers = users.filter((user) => user.email === email);
                return Promise.resolve(filteredUsers);
                
            },
            // Fake 'create' function to replace the 'create' function of the real UsersService
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 123456),
                    email,
                    password
                } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };
    
        // Create a DI container 
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                // When someone asks a copy of UsersService,
                // give the value 'fakeUsersService' 
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ],
        }).compile();
    
        service = module.get(AuthService);
        }
    )
    
    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });
    
    it('creates a new user with salted and hashed password', async () => {
        const user = await service.signUp('test@test.com', 'testPass');

        expect(user.password).not.toEqual('testPass');
        
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();

    });

    it('throws error when signing up with an existing user', async () => {
        await service.signUp('newEmail@test.com', 'pass');
        await expect(service.signUp('newEmail@test.com', 'pass')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('throws an error when signin with a non existing user', async () => {
        await expect(service.signIn('dontExistsEmail', 'doesntExistsPassword')).rejects.toThrow(NotFoundException);
    });

    it('throws if invalid password provided', async () => {
        await service.signUp('test@test.com', 'password');
        expect(service.signIn('test@test.com', 'wrong')).rejects.toThrow(BadRequestException);            
    });

    it('returns a user when a correct sign in user + password is made', async () => {
        await service.signUp('test@test.com', 'password');
        const user = await service.signIn('test@test.com', 'password');
        expect(user).toBeDefined();
    });
})

