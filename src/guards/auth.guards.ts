import {
    CanActivate,
    ExecutionContext
} from '@nestjs/common';
import { Observable } from 'rxjs';

// A Guard calls the canActivate function automatically
// when there is an incoming request.
// If it returns true - the request can continue to flow in the app.
// A false will reject the request (403).
// The Guard can be placed before the app, or a controller, or a handler.

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request.session.userId;
    }
}