import { HttpErrorResponse } from '@angular/common/http';

export interface AppHttpError {
    status: number;
    url: string;
    isNetworkError: boolean;
    isServerError: boolean;
    isClientError: boolean;
    message: string;
    serverBody: any;
    raw: HttpErrorResponse;
}
