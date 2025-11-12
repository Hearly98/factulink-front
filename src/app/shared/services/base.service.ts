import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export class BaseService {
  http: HttpClient;
  baseUrl: string;

  constructor(http: HttpClient, baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl;
  }

  getRequest<TResponse>(resource: string): Observable<TResponse> {
    return this.http.get<TResponse>(`${this.baseUrl}${resource}`, { headers: this.getHeaders() });
  }

  getRequestFile(resource: string, fileName: string): void {
    this.http.get(`${this.baseUrl}${resource}`, { observe: 'response', responseType: 'blob', headers: this.getHeaders() })
      .subscribe((response: HttpResponse<Blob>) => {
        this.processBlobResponse(response, fileName);
      });
  }

  headRequest<TResponse>(resource: string): Observable<TResponse> {
    return this.http.head<TResponse>(`${this.baseUrl}${resource}`, { headers: this.getHeaders() });
  }

  postRequest<TRequest, TResponse>(resource: string, body: TRequest): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.baseUrl}${resource}`, body, { headers: this.getHeaders() });
  }

  postRequestFile(resource: string, body: any, fileName: string): void {
    this.http.post(`${this.baseUrl}${resource}`, body, { observe: 'response', responseType: 'blob', headers: this.getHeaders() })
      .subscribe((response: HttpResponse<Blob>) => {
        this.processBlobResponse(response, fileName);
      });
  }

  postRequestForm<TResponse>(resource: string, form: any): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.baseUrl}${resource}`, form, { headers: this.getHeaders(false, false) });
  }

  putRequestForm<TResponse>(resource: string, form: any): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.baseUrl}${resource}`, form, { headers: this.getHeaders(false, false) });
  }

  postRequestFormFile<TResponse>(resource: string, file: File[]): Observable<TResponse> {
    const formData: FormData = new FormData();

    file.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post<TResponse>(`${this.baseUrl}${resource}`, formData, { headers: this.getHeaders(false, false) });
  }

  postRequestWithCredentials<TRequest, TResponse>(resource: string, body: TRequest): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.baseUrl}${resource}`, body, { headers: this.getHeaders(true), withCredentials: true });
  }

  putRequest<TRequest, TResponse>(resource: string, body: TRequest): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.baseUrl}${resource}`, body, { headers: this.getHeaders() });
  }

  deleteRequest<TResponse>(resource: string): Observable<TResponse> {
    return this.http.delete<TResponse>(`${this.baseUrl}${resource}`, { headers: this.getHeaders() });
  }

  patchRequest<TRequest, TResponse>(resource: string, body: TRequest): Observable<TResponse> {
    return this.http.patch<TResponse>(`${this.baseUrl}${resource}`, body, { headers: this.getHeaders() });
  }

  private processBlobResponse(response: HttpResponse<Blob>, fileName: string) {
    const header = response.headers.get('Content-Disposition');
    const parts = header != null && header != undefined ? header.split(';') : [];
    const file = parts.filter(item => item.includes('filename') && !item.includes('utf'))[0];
    const nameParts = (file ?? '').split('=');
    let filename = nameParts.length > 1 ? nameParts[1].split('"').join('') : null;

    filename = filename ?? fileName
    filename = filename ?? 'untitled_file';

    const blob = response.body;
    const href = window.URL.createObjectURL(blob as any);
    const link = document.createElement('a');

    link.href = href;
    link.setAttribute('download', filename);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  getHeaders(withCredentials = false, contentType = true): HttpHeaders {
    let credentialHeaders = {}

    if (withCredentials) {
      credentialHeaders = {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': this.baseUrl.replace('/v1', ''),
        'Access-Control-Allow-Headers': '*'
      };
    }

    const httpHeaders = contentType ?
      new HttpHeaders({
        'Content-Type': 'application/json',
        ...credentialHeaders
      }) :
      new HttpHeaders({
        ...credentialHeaders
      });

    return httpHeaders;
  }
}
