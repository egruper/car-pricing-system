import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt} from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signUp(email: string, password: string) {
        // Make sure the email is not in use
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('email in use');
        }

        // Hash user's password
        // Generate a SALT
        const salt = randomBytes(8).toString('hex');   
        // Hash the SALT and password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // Join the hashed result and the SALT together
        const result = salt + '.' + hash.toString('hex');
        // Create a new user and save it
        const user = await this.usersService.create(email, result);
        
        return user;
    }

    async signIn(email: string, password: string) {
        // Make sure email is in use. find() will return array of users with given email.
        // We want 1 user so we declare [user]
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await scrypt(password, salt, 32) as Buffer;
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }
        
        return user;
    }
}