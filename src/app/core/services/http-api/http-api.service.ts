import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

import { ToastService } from '../toast/toast.service';
import { underMaintenance } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(ToastService);

  private checkMaintenance<T>(): Observable<T> | null {
    if (underMaintenance) return of({} as T);
    return null;
  }

  public get<Response>(
    url: string,
    headers: HttpHeaders,
    params: HttpParams | undefined = undefined
  ): Observable<Response> {
    const maintenanceError = this.checkMaintenance<Response>();
    if (maintenanceError) return maintenanceError;

    return this.httpClient
      .get<Response>(url, { headers: headers, params: params })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  public getBlob(
    url: string,
    headers: HttpHeaders,
    params: HttpParams | undefined = undefined
  ): Observable<Blob> {
    const maintenanceError = this.checkMaintenance<Blob>();
    if (maintenanceError) return maintenanceError;

    return this.httpClient
      .get(url, { headers: headers, params: params, responseType: 'blob' })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  public post<Request, Response>(
    url: string,
    headers: HttpHeaders,
    body: Request
  ): Observable<Response> {
    const maintenanceError = this.checkMaintenance<Response>();
    if (maintenanceError) return maintenanceError;

    return this.httpClient
      .post<Response>(url, body, { headers: headers, withCredentials: true })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  public put<Request, Response>(
    url: string,
    headers: HttpHeaders,
    body: Request
  ): Observable<Response> {
    const maintenanceError = this.checkMaintenance<Response>();
    if (maintenanceError) return maintenanceError;

    return this.httpClient
      .put<Response>(url, body, { headers: headers })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  public delete<Request, Response>(
    url: string,
    headers: HttpHeaders,
    body?: Request
  ): Observable<Response> {
    const maintenanceError = this.checkMaintenance<Response>();
    if (maintenanceError) return maintenanceError;

    return this.httpClient
      .delete<Response>(url, { headers: headers, body: body })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // cover valid error cases
    switch (error.status) {
      case 401:
        // Handled by interceptor
        break;
      case 403:
        // can occur on user settings page, reset password page...
        break;
      case 404:
        // API returns 404 for valid reasons, such as no pfp set, not an error
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
