import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPageComponent } from './components/user-page/user-page.component';

const routes: Routes = [
  { path: ':id', component: UserPageComponent },
  { path: 'donate', redirectTo: 'donacije', pathMatch: 'full' },
  { path: 'doniraj', redirectTo: 'donacije', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }