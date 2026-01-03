import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { UpdateUserDto} from '@features/user/models/update-user.interface';
import { SetPfpDto } from '@features/user/models/update-pfp.interface';
import { UpdatePasswordDto } from '@features/user/models/update-password.interface';
import { DeleteProfileDto } from '@features/user/models/delete-profile.interface';
import { UploaderRequestDto } from '@features/user/models/uploader-request.interface';
import { BaseHttpService } from '@core/services/base-http/base-http.service';
import { ApplicationDataService } from '@core/services/application-data/application-data.service';
import { GetUserModel } from '@models/get-user.interface';
import { ApiType } from '@core/enums/api-type.enum';
import { JwtTokenResponse } from '@models/jwt-token-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService {
  private readonly applicationDataService = inject(ApplicationDataService);

  public getUserByUsername(username: string): Observable<GetUserModel> {
    return this.getJson<GetUserModel>(`user?username=${encodeURIComponent(username)}`);
  }

  public buildPfpUrl(username: string): string {
    // name of pfp image is the same as user's username
    // nginx serves the image directly and takes care of file extension
    return `${this.createUrl('pfp', ApiType.Api)}/${username}`;
  }

  public updateUser(updateUserDto: UpdateUserDto): Observable<JwtTokenResponse> {
    return this.postJson<UpdateUserDto, JwtTokenResponse>(`user/updateUser`, updateUserDto);
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
    const userModel = this.applicationDataService.getUser();
    return userModel ? userModel.role.toLowerCase() : null;
  }
}
