import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  constructor(
    private readonly httpClient: HttpClient,
    // private readonly authService: AuthService // circular dependency
  ) { }

  public get<Response>(
    url: string,
    headers: HttpHeaders,
    params: HttpParams | undefined = undefined
  ): Observable<Response> {
    return this.httpClient.get<Response>(url, { headers: headers, params: params }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  public getBlob(
    url: string,
    headers: HttpHeaders,
    params: HttpParams | undefined = undefined
  ): Observable<Blob> {
    return this.httpClient.get(url, { headers: headers, params: params, responseType: 'blob' }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  public post<Request, Response>(
    url: string,
    headers: HttpHeaders,
    body: Request
  ): Observable<Response> {
    return this.httpClient.post<Response>(url, body, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  public put<Request, Response>(
    url: string,
    headers: HttpHeaders,
    body: Request
  ): Observable<Response> {
    return this.httpClient.put<Response>(url, body, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  public delete<Request, Response>(
    url: string,
    headers: HttpHeaders,
    body?: Request
  ): Observable<Response> {
    return this.httpClient.delete<Response>(url, { headers: headers, body: body }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    // TODO - implement better error handling/logging
    // move 401 handling here or to the interceptor?
    switch (error.status) {
      case 401:
        // this.authService.unauthorizedHandler(); // TODO
        break;
    }
    return throwError(() => error);
  }
}
