import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { UpdateUsernameDto } from '@features/user/models/update-username.interface';
import { UpdateEmailDto } from '@features/user/models/update-email.interface';
import { SetPfpDto } from '@features/user/models/update-pfp.interface';
import { UpdatePasswordDto } from '@features/user/models/update-password.interface';
import { DeleteProfileDto } from '@features/user/models/delete-profile.interface';
import { UploaderRequestDto } from '@features/user/models/uploader-request.interface';
import { BaseHttpService } from '@core/services/base-http/base-http.service';
import { TokenService } from '@core/services/token-service/token.service';
import { UserModel } from '@models/user.interface';
import { GetUserModel } from '@models/get-user.interface';
import { DecodedTokenModel } from '@models/decoded-token.interface';
import { ApiType } from '@core/enums/api-type.enum';
import { JwtTokenResponse } from '@models/jwt-token-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService {
  private readonly tokenService = inject(TokenService);

  public getUserById(userId: number | string): Observable<GetUserModel> {
    return this.getJson<GetUserModel>(`user/userId?userId=${userId}`);
  }

  public getUserByUsername(username: string): Observable<GetUserModel> {
    return this.getJson<GetUserModel>(`user/username?username=${encodeURIComponent(username)}`);
  }

  public getUserPfpUrl(pfpPath: string): string {
    return `${this.createUrl('pfp', ApiType.Api)}/${pfpPath}`;
  }

  public updateUsername(updateUsernameDto: UpdateUsernameDto): Observable<JwtTokenResponse> {
    return this.postJson<UpdateUsernameDto, JwtTokenResponse>(`user/updateUsername`, updateUsernameDto);
  }

  public updateEmail(updateEmailDto: UpdateEmailDto): Observable<JwtTokenResponse> {
    return this.postJson<UpdateEmailDto, JwtTokenResponse>(`user/updateEmail`, updateEmailDto);
  }

  public setPfp(setPfpDto: SetPfpDto): Observable<JwtTokenResponse> {
    const formData = new FormData();
    if (setPfpDto.profilePicFile) formData.append('ProfilePicFile', setPfpDto.profilePicFile);

    return this.postFormData<JwtTokenResponse>(`user/setPfp`, formData);
  }

  public updatePassword(updatePasswordDto: UpdatePasswordDto): Observable<void> {
    return this.postJson<UpdatePasswordDto, void>(`user/updatePassword`, updatePasswordDto);
  }

  public deleteProfile(deleteProfileDto: DeleteProfileDto): Observable<void> {
    return this.deleteJson<DeleteProfileDto, void>(`user/deleteUser`, deleteProfileDto);
  }

  public submitUploaderRequest(uploaderRequestDto: UploaderRequestDto): Observable<JwtTokenResponse> {
    return this.postJson<UploaderRequestDto, JwtTokenResponse>(`user/submitUploaderRequest`, uploaderRequestDto);
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
    const userModel = this.tokenService.getUserFromToken();
    return userModel ? userModel.role.toLowerCase() : null;
  }
}
