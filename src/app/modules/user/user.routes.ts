import { Routes } from '@angular/router';
import { UserPageComponent } from './components/user-page/user-page.component';

export const USER_ROUTES: Routes = [
    { path: ':id', component: UserPageComponent }
];