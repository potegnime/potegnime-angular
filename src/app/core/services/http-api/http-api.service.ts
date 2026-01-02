import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

import { TokenService } from '@core/services/token/token.service';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly toastService = inject(ToastService);

  public get<Response>(
    url: string,
    headers: HttpHeaders,
    params: HttpParams | undefined = undefined
  ): Observable<Response> {
    return this.httpClient
      .get<Response>(url, { headers: headers, params: params })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  public getBlob(
    url: string,
    headers: HttpHeaders,
    params: HttpParams | undefined = undefined
  ): Observable<Blob> {
    return this.httpClient
      .get(url, { headers: headers, params: params, responseType: 'blob' })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  public post<Request, Response>(
    url: string,
    headers: HttpHeaders,
    body: Request,
    withCredentials: boolean = false
  ): Observable<Response> {
    return this.httpClient
      .post<Response>(url, body, { headers: headers, withCredentials: withCredentials })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  public put<Request, Response>(
    url: string,
    headers: HttpHeaders,
    body: Request
  ): Observable<Response> {
    return this.httpClient
      .put<Response>(url, body, { headers: headers })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  public delete<Request, Response>(
    url: string,
    headers: HttpHeaders,
    body?: Request
  ): Observable<Response> {
    return this.httpClient
      .delete<Response>(url, { headers: headers, body: body })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // TODO - implement better error handling/logging
    // move 401 handling here or to the interceptor?

    // cover valid error cases
    console.log('HTTP Error Status:', error);
    switch (error.status) {
      
      case 401:
        // Handled by interceptor
        break;
      case 404:
        // API returns 404 for valid reasons, such as no pfp set, not an error
        break;
      case 403:
        // can occur on user settings page
        break;
      case 409:
        // can occur on register... (username/email already taken)
        break;
      default:
        // All other unexpected errors
        this.toastService.showError('Napaka na strežniku :(');
        break;
    }
    return throwError(() => error);
  }
}
