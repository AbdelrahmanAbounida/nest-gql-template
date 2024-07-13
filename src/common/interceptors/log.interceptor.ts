import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('Before: Hi before implementation from logger interceptor');
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log('After: By After implementation from logger interceptor'),
        ),
      );
  }
}
