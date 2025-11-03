import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';

@Component({
    selector: 'app-about-page',
    templateUrl: './about-page.component.html',
    styleUrls: ['./about-page.component.scss'],
    imports: [RouterLink],
    standalone: true
})
export class AboutPageComponent implements OnInit {
  private readonly authService = inject(AuthService);

  protected isLoggedIn: boolean = false;

  public ngOnInit(): void {
    this.isLoggedIn = this.authService.verifyToken();
  }
}
