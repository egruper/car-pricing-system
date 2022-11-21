import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express'
import { UsersService } from "../users.service";
import { User } from "../user.entity";


// By default the request object doesn't have a 'currentUser' property,
// so we try to assign a pvalue to a property that doesn't exists.
// To fix this, we will modify the definition of the request interface and add a potential property 'currentUser'.
// and tell the Request interface that it might have a currentUser prpoperty
// and if there is then it will be of type User.
declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}

        // @param next - the next middleware in the chain we want to execute
        async use(req: Request, res: Response, next: NextFunction) {
        // Take the userId from the session.
        // We use an empty object ('|| {}') in case the user doesn't have a session object yet,
        // since we then try to de-structure an undefined value.
        // If the user have a session then we pull its userId from it.
        const { userId } = req.session || {};  
        if (userId) {
            const user = await this.usersService.findOne(userId);
            req.currentUser = user;
        }

        // Run the next middleware that may exists
        next();
    }
}