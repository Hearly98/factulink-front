import { HttpErrorResponse } from '@angular/common/http';

export interface AppHttpError<T = any> {
  status: number;
  url: string;
  isNetworkError: boolean;
  isServerError: boolean;
  isClientError: boolean;
  message: string;
  serverBody: any;
  error?: T;
  raw: HttpErrorResponse;
}
