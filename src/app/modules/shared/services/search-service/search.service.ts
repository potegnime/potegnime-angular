import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { urlConst } from 'src/app/modules/shared/enums/url.enum';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private readonly http: HttpClient
  ) {}

  search(query: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'accept': '*/*'
    });

    return this.http.get<any>(`${urlConst.apiBase}/search?q=${query}`, {headers : headers}).pipe(
      map((response: any) => {
        console.log(response);
        return response;
      })   
    );
  }
}
