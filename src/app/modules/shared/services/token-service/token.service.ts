import { Injectable } from '@angular/core';
import jwtDecode from "jwt-decode";
import { DecodedTokenModel } from '../../models/decoded-token.interface';
import { UploaderRequestStatus } from 'src/app/modules/sudo/enums/uploader-request-status.enum';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    public getToken(): string | null {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        return token;
    }

    public setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    public updateToken(newToken: string): void {
        this.deleteToken();
        this.setToken(newToken);
    }

    public deleteToken(): void {
        localStorage.removeItem('token');
    }

    public decodeToken(): DecodedTokenModel | null {
        const token = this.getToken();
        if (!token) {
            return null;
        }
        const decodedToken = jwtDecode(token) as DecodedTokenModel;
        try {

            const formattedToken: DecodedTokenModel = {
                uid: Number(decodedToken.uid),
                username: decodedToken.username,
                email: decodedToken.email,
                role: decodedToken.role,
                joined: decodedToken.joined,
                iss: decodedToken.iss,
                aud: decodedToken.aud,
                iat: decodedToken.iat,
                exp: Number(decodedToken.exp)
            };

            if (decodedToken.uploaderRequestStatus) {
                formattedToken.uploaderRequestStatus = decodedToken.uploaderRequestStatus as UploaderRequestStatus;
            }

            return formattedToken;
        } catch (error) {
            return null;
        }
    }

}
