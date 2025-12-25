import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {
  private readonly router = inject(Router);

  canActivate() {
    const isUnderMaintenance = environment.underMaintenance;
    if (!isUnderMaintenance) {
      this.router.navigate(['/']);
      return false;
    };
    return true;
  }
}
