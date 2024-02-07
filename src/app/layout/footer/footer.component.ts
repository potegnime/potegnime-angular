import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { UserService } from 'src/app/modules/user/services/user.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    protected uid: number | null;
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {
        this.uid = userService.getLoggedUserId();
        if (!this.uid) {
            this.authService.logout();
        }
    }
}
