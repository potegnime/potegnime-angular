import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { UserService } from 'src/app/modules/user/services/user-service/user.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent implements OnInit {
    protected uid!: number | null;
    protected isAdmin: boolean = false;

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly router: Router
    ) { }

    public ngOnInit(): void {
        this.uid = this.userService.getLoggedUserId();
        this.isAdmin = this.userService.isAdminLogged();
        if (!this.uid) {
            this.authService.logout();
        }
    }

    protected exploreClick(section: string | null) {
        if (!section) {
            this.router.navigate(['/razisci']);
        }
        let queryParams = {
            s: section
        }
        this.router.navigate(['/razisci'], { queryParams: queryParams });
    }

    protected logout() {
        this.authService.logout();
    }

}
