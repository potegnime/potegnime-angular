import { UserService } from '../../../user/services/user-service/user.service';
import { Injectable } from '@angular/core'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AdminGuard {
    constructor(
        private readonly userService: UserService,
        private readonly router: Router,
        private readonly toastr: ToastrService
    ) { }

    canActivate() {
        if (this.userService.isAdminLogged()) {
            return true;
        } else {
            this.toastr.error('', 'Dostop ni dovoljen', { timeOut: 5000 });
            return false;
        }
    }
}
