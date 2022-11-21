import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, plainToInstance } from 'class-transformer';

// This interface means that it wants to receive any class 
interface ClassConstructor {
    new (...args: any[]): {}
}

// Creating our custome decorator so we can pass any
// type of dto here and not just UserDto
export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before the request is handled by the request handler
        // i.e. - console.log('Im running before the handler', context);
        return handler.handle().pipe(
            // data is the outgoing data inside our response
            map((data: any) => {
                // Run something before the response is sent out
                // i.e. - console.log('Im running before response is sent out', data);
                return plainToInstance(this.dto, data, {
                    // Share only what is defined as @Expose in user.dto.ts
                    excludeExtraneousValues: true,
                })
            })
        )
    }
}