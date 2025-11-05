import { Injectable } from '@angular/core';

import { BaseHttpService } from '@core/services/base-http/base-http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseHttpService {
  public getNotifications() {
    // TODO - Implement notifications
  }
}
