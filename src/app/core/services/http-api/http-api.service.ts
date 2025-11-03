import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly toastr = inject(ToastrService);

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
    // TODO - implement better error handling/logging
    // move 401 handling here or to the interceptor?

    // cover valid error cases
    switch (error.status) {
      case 401:
        this.tokenService.deleteToken();
        this.router.navigate(['/prijava']);
        break;
      case 404:
        // API returns 404 for valid reasons, such as no pfp set, not an error
        break;
      default:
        // All other unexpected errors
        // TODO - show dialog instead of toast?
        this.toastr.error('', 'Napaka na strežniku :(', { timeOut: timingConst.error });
        console.error(error);
        break;
    }
    return throwError(() => error);
  }
}
