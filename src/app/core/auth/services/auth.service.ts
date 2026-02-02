import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map, switchMap, of } from 'rxjs';
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
  private readonly USER_KEY = 'factu_user';

  // State
  private _user = signal<User | null>(null);
  public user = this._user.asReadonly();
  public isAuthenticated = computed(() => !!this._user() || !!this.getToken());

  constructor() {
    // Try to load user if token and stored user exist
    const token = this.getToken();
    const storedUser = localStorage.getItem(this.USER_KEY);

    if (token && storedUser) {
      try {
        this._user.set(JSON.parse(storedUser));
        // NO cargar permisos aquí para evitar dependencia circular
      } catch (e) {
        // Solo limpiar si hay error al parsear el usuario
        localStorage.removeItem(this.USER_KEY);
      }
    }

    // NO verificar el usuario al inicializar para evitar borrar el localStorage
    // La verificación se hará cuando sea necesario (en guards o al navegar)
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setToken(res.access_token);
        this.setUser(res.user);
      })
      // NO cargar permisos aquí - se cargarán después del login en el componente
    );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        this.setToken(res.access_token);
        this.setUser(res.user);
      })
      // NO cargar permisos aquí - se cargarán después del registro en el componente
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
      tap((user) => this.setUser(user))
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  logoutLocal(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem('menuConfig');
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
