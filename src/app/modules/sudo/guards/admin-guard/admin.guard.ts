import { UserService } from '../../../user/services/user-service/user.service';
import { Injectable, inject } from '@angular/core'
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    private readonly userService = inject(UserService);
    private readonly toastr = inject(ToastrService);
    private readonly router = inject(Router);

    canActivate() {
        if (this.userService.isAdminLogged()) {
            return true;
        } else {
            this.toastr.error('', 'Dostop ni dovoljen', { timeOut: timingConst.error });
            this.router.navigate(['/']);
            return false;
        }
    }
}