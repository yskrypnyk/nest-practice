import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {map, Observable, tap} from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...')

        //intercepts response using RxJS and gets data before it is sent to user
        return next.handle().pipe(
            map((data)=>({data}))
            // tap(data => console.log('After...', data))
        );
    }
}
