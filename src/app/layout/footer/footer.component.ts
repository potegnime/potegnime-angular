import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { UserService } from '@features/user/services/user/user.service';
import { DecodedTokenModel } from '@models/decoded-token.interface';

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

  protected user: DecodedTokenModel | undefined;
  protected isAdmin: boolean = false;

  public ngOnInit(): void {
    this.user = this.userService.getLoggedUser();
    this.isAdmin = this.userService.isAdminLogged();
    if (!this.user) {
      this.authService.logout();
    }
  }

  protected exploreClick(section: string | null) {
    if (!section) {
      this.router.navigate(['/razisci']);
    }
    let queryParams = {
      s: section
    };
    this.router.navigate(['/razisci'], { queryParams: queryParams });
  }

  protected logout() {
    this.authService.logout();
  }
}
