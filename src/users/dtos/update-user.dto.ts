import { IsEmail, IsString, IsOptional } from "class-validator";

export class UpdateUserDto {
    // @IsOptional allows us to provide an email, or not privde one.
    // In case email is not provided - we will still pass this validation
    @IsEmail() 
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;
}