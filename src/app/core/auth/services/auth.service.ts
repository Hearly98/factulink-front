import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'factu_token';

  // State
  private _user = signal<User | null>(null);
  public user = this._user.asReadonly();
  public isAuthenticated = computed(() => !!this._user() || !!this.getToken());

  constructor() {
    // Try to load user if token exists
    if (this.getToken()) {
      this.getUser().subscribe({
        next: (user) => this._user.set(user),
        error: () => this.logoutLocal()
      });
    }
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setToken(res.access_token);
        this._user.set(res.user);
      })
    );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        this.setToken(res.access_token);
        this._user.set(res.user);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.logoutLocal()),
      catchError((err) => {
        this.logoutLocal();
        return throwError(() => err);
      })
    );
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user) => this._user.set(user))
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logoutLocal(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
