// The Expose decorator tells to explicitly share a property.
// The Exclude decorator tells not to share a property.
import { Expose } from "class-transformer"; 

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;
}