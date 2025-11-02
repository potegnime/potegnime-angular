import { Injectable } from '@angular/core';
import { BaseHttpService } from 'src/app/core/services/base-http/base-http.service';
import { HttpApiService } from 'src/app/core/services/http-api/http-api.service';
import { ConfigService } from 'src/app/core/services/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseHttpService {

  constructor(
    httpApiService: HttpApiService,
    configService: ConfigService,
  ) {
    super(httpApiService, configService);
  }

  public getNotifications() {
    // TODO - Implement notifications
  }
}
