import { Injectable } from '@angular/core';
import { HttpApiService } from '../http-api/http-api.service';
import { ApiType } from '../../enums/api-type.enum';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseHttpService {

  constructor(
    private readonly httpApiService: HttpApiService,
    private readonly configService: ConfigService
  ) { }

  protected getJson<Response>(
    urlPath: string,
    apiType: ApiType = ApiType.Api
  ) {
    return this.httpApiService.get<Response>(
      this.createUrl(urlPath, apiType),
      this.createHeaders()
    )
  }

  protected getBlob(
    urlPath: string,
    apiType: ApiType = ApiType.Api
  ): Observable<Blob> {
    return this.httpApiService.getBlob(
      this.createUrl(urlPath, apiType),
      this.createHeaders()
    );
  }

  protected postJson<Request, Response>(
    urlPath: string,
    body: Request,
    apiType: ApiType = ApiType.Api
  ): Observable<Response> {
    return this.httpApiService.post<Request, Response>(
      this.createUrl(urlPath, apiType),
      this.createHeaders(),
      body
    );
  }

  protected postFormData<Response>(
    urlPath: string,
    body: FormData,
    apiType: ApiType = ApiType.Api
  ): Observable<Response> {
    // FormData automatically sets Content-Type with boundary, no need to set it here - just return minimal headers
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');

    return this.httpApiService.post<FormData, Response>(
      this.createUrl(urlPath, apiType),
      headers,
      body
    );
  }

  protected putJson<Request, Response>(
    urlPath: string,
    body: Request,
    apiType: ApiType = ApiType.Api
  ): Observable<Response> {
    return this.httpApiService.put<Request, Response>(
      this.createUrl(urlPath, apiType),
      this.createHeaders(),
      body
    );
  }

  protected deleteJson<Request, Response>(
    urlPath: string,
    body?: Request,
    apiType: ApiType = ApiType.Api
  ): Observable<Response> {
    return this.httpApiService.delete<Request, Response>(
      this.createUrl(urlPath, apiType),
      this.createHeaders(),
      body
    );
  }

  private createUrl(
    urlPath: string,
    apiType: ApiType
  ): string {
    let apiUrl: string = this.configService.getApiUrl(apiType);
    apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
    return `${apiUrl}/${urlPath}`;
  }

  private createHeaders(): HttpHeaders {
    // TODO - maybe add parameter to add more headers?
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json'); // Check if needed
    return headers;
  }
}
