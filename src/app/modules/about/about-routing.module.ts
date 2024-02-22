import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { DonatePageComponent } from './components/donate-page/donate-page.component';
import { TermsPageComponent } from './components/terms-page/terms-page.component';
import { AuthGuard } from '../auth/guards/auth/auth.guard';
import { LicensePageComponent } from './components/license-page/license-page.component';

const routes: Routes = [
    { path: 'o-nas', component: AboutPageComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'donacije', component: DonatePageComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'donate', redirectTo: 'donacije', pathMatch: 'full' },
    { path: 'doniraj', redirectTo: 'donacije', pathMatch: 'full' },
    { path: 'pogoji', component: TermsPageComponent, pathMatch: 'full' },
    { path: 'terms', redirectTo: 'pogoji', pathMatch: 'full' },
    { path: 'licenca', component: LicensePageComponent, pathMatch: 'full' },
    { path: 'license', redirectTo: 'licenca', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AboutRoutingModule { }