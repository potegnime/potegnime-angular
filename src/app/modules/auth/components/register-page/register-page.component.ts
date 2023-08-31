import { Component } from '@angular/core';
import { UserRegisterDto } from '../../models/user/user-register-dto.model';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  
  userRegisterDto: UserRegisterDto = new UserRegisterDto();

}
