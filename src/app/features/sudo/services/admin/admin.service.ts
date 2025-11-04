import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseHttpService } from '@core/services/base-http/base-http.service';
import { UpdateRoleDto } from '@features/user/models/update-role.interface';
import { UploaderRequestDto } from '@features/user/models/uploader-request.interface';

@Injectable({
    providedIn: 'root' // TODO - make lazy loaded
})
export class AdminService extends BaseHttpService {
    public deleteProfileAdmin(username: string): Observable<any> {
        return this.deleteJson<any, any>(`admin/adminDelete?username=${encodeURIComponent(username)}`);
    }

    public updateRole(updateRoleDto: UpdateRoleDto): Observable<any> {
        return this.postJson<UpdateRoleDto, any>(`admin/updateRole`, updateRoleDto);
    }

    public uploaderRequest(uploaderRequestDto: UploaderRequestDto): Observable<any[]> {
        return this.postJson<UploaderRequestDto, any[]>(`admin/uploaderRequest`, uploaderRequestDto);
    }
}
