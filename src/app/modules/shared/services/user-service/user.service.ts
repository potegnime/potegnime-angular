import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';
import { TokenService } from '../token-service/token.service';
import { urlConst } from '../../enums/url.enum';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly token: string | null;
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly tokenService: TokenService
    ) {
        this.token = this.tokenService.getToken();
        if (!this.token) {
            this.authService.logout();
        }
    }

    public getUserById(userId: number | string): Observable<any> {
        const headers = new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        });

        return this.http.get(`${urlConst.apiBase}/user/${userId}`, { headers: headers }).pipe(
            map((response: any) => {
                return response;
            }),
            catchError((error: any) => {
                if (error.status === 401) {
                    this.authService.unauthorizedHandler();
                    return error;
                }
                console.log('FAK');
                return error;
            })
        );
    }

    public updatePfp(userId: number, profilePicture: File): Observable<any> {
        const headers = new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        });

        return this.http.post(`${urlConst.apiBase}/user/updatePfp?userId=${userId}`, { headers: headers }).pipe(
            map((response: any) => {
                return response;
            }),
            catchError((error: any) => {
                if (error.status === 401) {
                    this.authService.unauthorizedHandler();
                    return error;
                }
                return error;
            })
        );
    }

    public getUploadedTorrents(userId: number): Observable<any> {
        const headers = new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        });

        return this.http.get(`${urlConst.apiBase}/user/uploadedTorrents?userId=${userId}`, { headers: headers }).pipe(
            map((response: any) => {
                return response;
            }),
            catchError((error: any) => {
                if (error.status === 401) {
                    this.authService.unauthorizedHandler();
                    return;
                }
                return error;
            })
        );
    }

    public getLikedTorrents(userId: number): Observable<any> {
        const headers = new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        });

        return this.http.get(`${urlConst.apiBase}/user/likedTorrents?userId=${userId}`, { headers: headers }).pipe(
            map((response: any) => {
                return response;
            }),
            catchError((error: any) => {
                if (error.status === 401) {
                    this.authService.unauthorizedHandler();
                    return;
                }
                return error;
            })
        );
    }

    public getLoggedUserId(): number | null {
        const decodedToken = this.tokenService.decodeToken();
        if (decodedToken) {
            return decodedToken.uid;
        } else {
            return null;
        }
    }
}
