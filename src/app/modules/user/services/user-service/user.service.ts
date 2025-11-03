import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUsernameDto } from 'src/app/modules/user/models/update-username.interface';
import { UpdateEmailDto } from 'src/app/modules/user/models/update-email.interface';
import { UpdatePfpDto } from 'src/app/modules/user/models/update-pfp.interface';
import { UpdatePasswordDto } from 'src/app/modules/user/models/update-password.interface';
import { DeleteProfileDto } from 'src/app/modules/user/models/delete-profile.interface';
import { UploaderRequestDto } from '../../models/uploader-request.interface';
import { BaseHttpService } from 'src/app/core/services/base-http/base-http.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';

@Injectable({
    providedIn: 'root' // TODO - make lazy loaded
})
export class UserService extends BaseHttpService {
    private readonly tokenService = inject(TokenService);

    public getUserById(userId: number | string): Observable<any> {
        return this.getJson<any>(`user/userId?userId=${userId}`);
    }

    public getUserByUsername(username: string): Observable<any> {
        return this.getJson<any>(`user/username?username=${encodeURIComponent(username)}`);
    }

    public getUserPfp(userId: number | string): Observable<Blob> {
        return this.getBlob(`user/pfp/${userId}`);
    }

    public updateUsername(updateUsernameDto: UpdateUsernameDto): Observable<any> {
        return this.postJson<UpdateUsernameDto, any>(`user/updateUsername`, updateUsernameDto);
    }

    public updateEmail(updateEmailDto: UpdateEmailDto): Observable<any> {
        return this.postJson<UpdateEmailDto, any>(`user/updateEmail`, updateEmailDto);
    }

    public updatePfp(updatePfpDto: UpdatePfpDto): Observable<any> {
        const formData = new FormData();
        if (updatePfpDto.profilePicFile) formData.append("ProfilePicFile", updatePfpDto.profilePicFile);

        return this.postFormData<any>(`user/updatePfp`, formData);
    }

    public updatePassword(updatePasswordDto: UpdatePasswordDto): Observable<any> {
        return this.postJson<UpdatePasswordDto, any>(`user/updatePassword`, updatePasswordDto);
    }

    public deleteProfile(deleteProfileDto: DeleteProfileDto): Observable<any> {
        return this.deleteJson<DeleteProfileDto, any>(`user/deleteUser`, deleteProfileDto);
    }

    public submitUploaderRequest(uploaderRequestDto: UploaderRequestDto): Observable<any> {
        return this.postJson<UploaderRequestDto, any>(`user/submitUploaderRequest`, uploaderRequestDto);
    }

    public getLoggedUserId(): number | null {
        const decodedToken = this.tokenService.decodeToken();
        return decodedToken ? decodedToken.uid : null;
    }

    public isAdminLogged(): boolean {
        const role = this.getUserRole();
        return role === 'admin';
    }

    public isUploaderLogged(): boolean {
        const role = this.getUserRole();
        return role === 'uploader';
    }

    public isUserLogged(): boolean {
        const role = this.getUserRole();
        return role === 'user';
    }

    private getUserRole(): string | null {
        const decodedToken = this.tokenService.decodeToken();
        return decodedToken ? decodedToken.role.toLowerCase() : null;
    }
}
