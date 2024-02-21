import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { TokenService } from '../../shared/services/token-service/token.service';
import { urlConst } from '../../shared/enums/url.enum';
import { UpdateUsernameDto } from 'src/app/modules/user/models/update-username.interface';
import { UpdateEmailDto } from 'src/app/modules/user/models/update-email.interface';
import { UpdatePfpDto } from 'src/app/modules/user/models/update-pfp.interface';
import { UpdatePasswordDto } from 'src/app/modules/user/models/update-password.interface';
import { DeleteProfileDto } from 'src/app/modules/user/models/delete-profile.interface';
import { UpdateRoleDto } from '../models/update-role.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly tokenService: TokenService
    ) { }

    public getUserById(userId: number | string): Observable<any> {
        const headers = new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get(`${urlConst.apiBase}/user/userId?userId=${userId}`, { headers: headers });
    }

    public getUserByUsername(username: string): Observable<any> {
        const headers = new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get(`${urlConst.apiBase}/user/username?username=${username}`, { headers: headers });
    }

    public getUserPfp(userId: number | string): Observable<Blob> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get(`${urlConst.apiBase}/user/pfp/${userId}`, { headers, responseType: 'blob' });
    }

    public updateUsername(UpdateUsernameDto: UpdateUsernameDto): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        const formData = new FormData();
        formData.append("Username", UpdateUsernameDto.username);

        return this.http.post<any>(`${urlConst.apiBase}/user/updateUsername`, formData, { headers });
    }

    public updateEmail(updateEmailDto: UpdateEmailDto): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        const formData = new FormData();
        formData.append("Email", updateEmailDto.email);

        return this.http.post<any>(`${urlConst.apiBase}/user/updateEmail`, formData, { headers });
    }

    public updatePfp(updatePfpDto: UpdatePfpDto): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        const formData = new FormData();
        if (updatePfpDto.profilePicFile) {
            formData.append("ProfilePicFile", updatePfpDto.profilePicFile);
        }
        
        return this.http.post<any>(`${urlConst.apiBase}/user/updatePfp`, formData, { headers });
    }

    public updatePassword(updatePasswordDto: UpdatePasswordDto): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        const formData = new FormData();
        formData.append("OldPassword", updatePasswordDto.oldPassword);
        formData.append("NewPassword", updatePasswordDto.newPassword);

        return this.http.post<any>(`${urlConst.apiBase}/user/updatePassword`, formData, { headers });
    }

    public deleteProfile(deleteProfileDto: DeleteProfileDto): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        const formData: FormData = new FormData();
        formData.append('Password', deleteProfileDto.password);

        return this.http.delete<any>(`${urlConst.apiBase}/user/deleteUser`, { headers: headers, body: formData });
    }

    public deleteProfileAdmin(username: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.delete<any>(`${urlConst.apiBase}/user/adminDelete?username=${username}`, { headers: headers });

    } 

    public updateRole(updateRoleDto: UpdateRoleDto): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        const formData: FormData = new FormData();
        formData.append('UserId', updateRoleDto.userId.toString());
        formData.append('RoleName', updateRoleDto.roleName);

        return this.http.post<any>(`${urlConst.apiBase}/user/updateRole`, formData, { headers })
    }

    public getLoggedUserId(): number | null {
        const decodedToken = this.tokenService.decodeToken();
        if (decodedToken) {
            return decodedToken.uid;
        } else {
            return null;
        }
    }

    public isAdminLogged(): boolean {
        const decodedToken = this.tokenService.decodeToken();
        if (decodedToken?.role == '1') return true;
        return false;
    }
}
