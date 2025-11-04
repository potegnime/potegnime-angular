import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-license-page',
    templateUrl: './license-page.component.html',
    styleUrls: ['./license-page.component.scss'],
    imports: [RouterLink],
    standalone: true
})
export class LicensePageComponent implements OnInit {
  private authService = inject(AuthService);

  protected isLoggedIn: boolean = false;

  public ngOnInit(): void {
    this.isLoggedIn = this.authService.verifyToken();
  }
}
