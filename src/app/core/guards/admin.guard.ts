import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '@features/user/services/user/user.service';
import { ToastService } from '@core/services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  canActivate() {
    if (this.userService.isAdminLogged()) {
      return true;
    } else {
      this.toastService.showError('Dostop ni dovoljen');
      this.router.navigate(['/']);
      return false;
    }
  }
}
