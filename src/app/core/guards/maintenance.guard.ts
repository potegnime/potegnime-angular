import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { underMaintenance } from 'src/environment';


@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {
  private readonly router = inject(Router);

  canActivate() {
    if (!underMaintenance) {
      this.router.navigate(['/']);
      return false;
    };
    return true;
  }
}
