import {IsEmail, IsString} from 'class-validator'

// Lists all the different properties that 
// incoming request to create a user should have
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string; 

}