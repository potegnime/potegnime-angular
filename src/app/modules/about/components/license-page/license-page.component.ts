import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service/auth.service';

@Component({
  selector: 'app-license-page',
  templateUrl: './license-page.component.html',
  styleUrls: ['./license-page.component.scss']
})
export class LicensePageComponent implements OnInit {
  protected isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService
  ) { }

  public ngOnInit(): void {
    this.isLoggedIn = this.authService.verifyToken();
  }
}
