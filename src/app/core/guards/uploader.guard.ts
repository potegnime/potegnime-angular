import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '@features/user/services/user/user.service';
import { timingConst } from '@core/enums/toastr-timing.enum';

@Injectable({
  providedIn: 'root'
})
export class UploaderGuard implements CanActivate {
  private readonly userService = inject(UserService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  canActivate() {
    if (this.userService.isUploaderLogged() || this.userService.isAdminLogged()) {
      return true;
    } else {
      this.toastr.error('', 'Dostop ni dovoljen', { timeOut: timingConst.error });
      this.router.navigate(['/']);
      return false;
    }
  }
}
