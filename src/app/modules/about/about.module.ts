import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { DonatePageComponent } from './components/donate-page/donate-page.component';
import { AuthGuard } from '../auth/guards/auth/auth.guard';
import { AboutRoutingModule } from './about-routing.module';
import { LicensePageComponent } from './components/license-page/license-page.component';

@NgModule({
    declarations: [
        AboutPageComponent,
        DonatePageComponent,
        LicensePageComponent
    ],
    imports: [
        CommonModule,
        AboutRoutingModule
    ],
    providers: [
        AuthGuard
    ]
})
export class AboutModule { }
