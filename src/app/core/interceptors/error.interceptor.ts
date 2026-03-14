import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifier = inject(NotificationService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.error?.message ??
        error.message ??
        'Something went wrong while talking to our servers.';
      notifier.error(message);
      return throwError(() => error);
    }),
  );
};
