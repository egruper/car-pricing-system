import { NestInterceptor,
         ExecutionContext,
         CallHandler,
         Injectable } from "@nestjs/common";   
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    // Finds a user.
    // @param context - a wrapper around the incoming request
    // @param CallHandler -  a reference to to the actual route handler that will run 
    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if (userId) {
            const user = this.usersService.findOne(userId);
            // Assign the found user to the request object.
            // This will allow us to access the user object in our 
            // @CustomeUser decorator, because the request object
            // is available to the decorator 
            request.currentUser = user;
            request.c
        }

        // Go ahead and run the actual route handler
        return handler.handle();
        
    }
}