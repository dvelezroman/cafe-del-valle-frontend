import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'EDITOR' | 'PARTNER';
}

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    user: User;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api';
    private tokenKey = 'cafe_del_valle_token';
    private refreshTokenKey = 'cafe_del_valle_refresh_token';
    private userKey = 'cafe_del_valle_user';
    private refreshTokenInProgress = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    currentUser = signal<User | null>(null);
    isAuthenticated = signal<boolean>(false);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadAuthState();
    }

    private loadAuthState() {
        const token = localStorage.getItem(this.tokenKey);
        const userJson = localStorage.getItem(this.userKey);

        if (token && userJson) {
            try {
                const user = JSON.parse(userJson);
                this.currentUser.set(user);
                this.isAuthenticated.set(true);
            } catch (e) {
                this.logout();
            }
        }
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
            tap(res => {
                this.setSession(res);
            })
        );
    }

    subscribe(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/partners/subscribe`, data);
    }

    private setSession(res: AuthResponse) {
        localStorage.setItem(this.tokenKey, res.access_token);
        if (res.refresh_token) {
            localStorage.setItem(this.refreshTokenKey, res.refresh_token);
        }
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.refreshTokenSubject.next(null);
        this.router.navigate(['/admin/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.getRefreshToken();
        
        if (!refreshToken) {
            this.logout();
            return throwError(() => new Error('No refresh token available'));
        }

        if (this.refreshTokenInProgress) {
            // If refresh is already in progress, wait for it
            return this.refreshTokenSubject.pipe(
                map(token => {
                    if (!token) {
                        throw new Error('Token refresh failed');
                    }
                    return { access_token: token, user: this.currentUser()! } as AuthResponse;
                })
            );
        }

        this.refreshTokenInProgress = true;
        this.refreshTokenSubject.next(null);

        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, {
            refresh_token: refreshToken
        }).pipe(
            tap(res => {
                this.refreshTokenInProgress = false;
                localStorage.setItem(this.tokenKey, res.access_token);
                if (res.user) {
                    localStorage.setItem(this.userKey, JSON.stringify(res.user));
                    this.currentUser.set(res.user);
                }
                this.refreshTokenSubject.next(res.access_token);
            }),
            catchError(error => {
                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(null);
                this.logout();
                return throwError(() => error);
            })
        );
    }

    hasRole(role: 'ADMIN' | 'EDITOR' | 'PARTNER'): boolean {
        const user = this.currentUser();
        return user ? user.role === role : false;
    }

    getCurrentUser(): User | null {
        return this.currentUser();
    }
}
