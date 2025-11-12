// interceptor-error.ts
import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AppHttpError } from "./core/types/app-http-error";

@Injectable()
export class InterceptorError implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("ERROR HTTP GLOBAL:", {
          url: req.url,
          status: error.status,
          message: error.message,
        });

        const appError: AppHttpError = {
          status: error.status ?? 0,
          url: (error as any)?.url ?? req.url,
          isNetworkError: error.status === 0,
          isServerError: error.status >= 500 && error.status < 600,
          isClientError: error.status >= 400 && error.status < 500,
          message: this.humanMessage(error),
          serverBody: error.error,
          raw: error,
        };

        return throwError(() => appError);
      })
    );
  }

  private humanMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return "No hay conexión con el servidor o la red fue interrumpida.";
    }
    if (err.status >= 500) {
      return "Error del servidor. Intenta nuevamente más tarde.";
    }
    if (err.status === 404) {
      return "Recurso no encontrado.";
    }
    if (err.status === 401 || err.status === 403) {
      return "No autorizado o acceso denegado.";
    }
    return err.message || "Ocurrió un error en la solicitud.";
  }
}
