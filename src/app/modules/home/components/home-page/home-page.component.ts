import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  constructor(private authService: AuthService) { }
    
  
  public logout() {
    this.authService.logout();
  }
}
