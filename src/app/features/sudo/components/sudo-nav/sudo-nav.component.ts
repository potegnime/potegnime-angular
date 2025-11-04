import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { UserService } from '@features/user/services/user/user.service';

@Component({
    selector: 'app-sudo-nav',
    templateUrl: './sudo-nav.component.html',
    styleUrls: ['./sudo-nav.component.scss'],
    imports: [RouterLink],
    standalone: true
})
export class SudoNavComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);

    protected uid!: number | null;
    protected isAdmin: boolean = false;
    protected isUploader: boolean = false;

    public ngOnInit(): void {
        this.uid = this.userService.getLoggedUserId();
        if (!this.uid) {
            this.authService.logout();
        }
        this.isAdmin = this.userService.isAdminLogged();
        this.isUploader = this.userService.isUploaderLogged();
    }

    protected logout() {
        this.authService.logout();
    }
}
