import { HttpInterceptorFn } from '@angular/common/http';
import { inject, NgZone } from '@angular/core';
import { tap } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const ngZone = inject(NgZone);
  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return ngZone.run(() => next(req));
};