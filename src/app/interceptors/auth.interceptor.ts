import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    const isAuthEndpoint = req.url.includes('/auth/');

    // Add token to request (except auth endpoints)
    if (token && !isAuthEndpoint) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // If 401 and not an auth endpoint
            if (error.status === 401 && !isAuthEndpoint) {
                if (isRefreshing) {
                    // If already refreshing, wait for the new token
                    return refreshTokenSubject.pipe(
                        filter(token => token !== null),
                        take(1),
                        switchMap(token => {
                            const cloned = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            return next(cloned);
                        })
                    );
                }

                isRefreshing = true;
                refreshTokenSubject.next(null);
                const refreshToken = authService.getRefreshToken();

                if (!refreshToken) {
                    isRefreshing = false;
                    authService.logout();
                    return throwError(() => error);
                }

                return authService.refreshToken().pipe(
                    switchMap((authResponse) => {
                        isRefreshing = false;
                        refreshTokenSubject.next(authResponse.access_token);
                        
                        // Retry the original request with new token
                        const cloned = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${authResponse.access_token}`
                            }
                        });
                        return next(cloned);
                    }),
                    catchError((refreshError) => {
                        isRefreshing = false;
                        refreshTokenSubject.next(null);
                        authService.logout();
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};
