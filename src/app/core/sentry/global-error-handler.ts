/*
import { ErrorHandler, Injectable } from "@angular/core";
import * as Sentry from "@sentry/angular";
import { environment } from "@environments/environment";
import { JwtPayload } from "@core/model/jwt-payload";
import jwt_decode from "jwt-decode";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {
    this.applyContextToSentry();
    Sentry.captureException(error);
    console.error(error);
  }

  applyContextToSentry() {
    const token = localStorage.getItem(
      `access_token_${environment.application.code}`
    );
    const empresa = JSON.parse(localStorage.getItem("empresa"));
    if (token && empresa) {
      const user: JwtPayload = jwt_decode(token);
      Sentry.setTag("usuario", user.DisplayName);
      Sentry.setTag("empresa", empresa.razonSocial);
    }
  }
}

*/