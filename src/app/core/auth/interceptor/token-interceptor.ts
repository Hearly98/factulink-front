/*
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private ngxUiLoaderService:NgxUiLoaderService,
    private authService: AuthService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (this.authService.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      });
      this.ngxUiLoaderService.start();
      return next.handle(request).pipe(
        catchError(x => this.checkUnauthorized(x)),
        finalize(() => {
          this.ngxUiLoaderService.stop();
      })
      );
    }
    return next.handle(request).pipe(
      catchError(x => this.checkUnauthorized(x)),
      finalize(() => {
        this.ngxUiLoaderService.stop();
    })
    );
  }


  checkUnauthorized(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      this.authService.logoutSession();
      return of(err.message);
    }

    return throwError(err);
  }
}

*/
