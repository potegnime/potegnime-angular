import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { UserService } from 'src/app/modules/user/services/user-service/user.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [RouterLink],
    standalone: true
})
export class FooterComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);

    protected uid!: number | null;
    protected isAdmin: boolean = false;

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
