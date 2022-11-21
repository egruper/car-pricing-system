import { createParamDecorator,
         ExecutionContext} from "@nestjs/common";
// Param Decorators exists outside the Dependancy Injection system,
// so our custome decorator can't get an instance of UsersService directly
// then use the value produced by it in the Param Decorator
// Solution: make an interceptor to get the current user 
// (the interceptor is part of the dependency injection system),
// The interceptor CurrentUserInterceptor will read in the seesion object, 
// and to read in the UsersService(through DI) 
// and we will expose the User (by fetching it from the DB according to its userId seesion) to the decorator

// The return value will be the argument to the route handler in the controller
export const CurrentUser = createParamDecorator (
    // ExecutionContext is a wrapper to the incoming request,
    // it can be used to abstract a web socket, grpc request, http request etc.
    // 'never' - means that this data is not going to be accessed/used in any way.
    (data: never, context: ExecutionContext) => {
        // Get the incoming http request
        const request = context.switchToHttp().getRequest();
        
        // In this point we have the user object in the request,
        // thanks to our CurrentUserInterceptor
        return request.currentUser;
    },
);
