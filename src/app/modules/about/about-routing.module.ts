import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { DonatePageComponent } from './components/donate-page/donate-page.component';
import { TermsPageComponent } from './components/terms-page/terms-page.component';
import { AuthGuard } from '../auth/guards/auth/auth.guard';

const routes: Routes = [
    { path: 'o-nas', component: AboutPageComponent, canActivate: [AuthGuard] },
    { path: 'donacije', component: DonatePageComponent, canActivate: [AuthGuard] },
    { path: 'donate', redirectTo: 'donacije', pathMatch: 'full' },
    { path: 'doniraj', redirectTo: 'donacije', pathMatch: 'full' },
    { path: 'pogoji', component: TermsPageComponent, pathMatch: 'full' },
    { path: 'terms', redirectTo: 'pogoji' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AboutRoutingModule { }