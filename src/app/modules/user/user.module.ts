import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPageComponent } from './components/user-page/user-page.component';
import { UserRoutingModule } from './user-routing.module';
import { share } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { SudoModule } from '../sudo/sudo.module';

@NgModule({
  declarations: [
    UserPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SudoModule,
    UserRoutingModule
  ]
})
export class UserModule { }
