import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        console.log('in AdminGuard');
        const request = context.switchToHttp().getRequest();
        if (!request.currentUser) {
            return false;
        }
        console.log('in AdminGuard2');
        return request.currentUser.admin;
    }
}