import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from 'src/app/core/services/base-http/base-http.service';
import { HttpApiService } from 'src/app/core/services/http-api/http-api.service';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { UpdateRoleDto } from 'src/app/modules/user/models/update-role.interface';
import { UploaderRequestDto } from 'src/app/modules/user/models/uploader-request.interface';

@Injectable({
    providedIn: 'root' // TODO - make lazy loaded
})
export class AdminService extends BaseHttpService {
    constructor(
        httpApiService: HttpApiService,
        configService: ConfigService,
    ) {
        super(httpApiService, configService);
    }

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
