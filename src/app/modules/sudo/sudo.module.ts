import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { SudoNavComponent } from './components/sudo-nav/sudo-nav.component';
import { SharedModule } from '../shared/shared.module';
import { AdministrationPageComponent } from './components/administration-page/administration-page.component';

@NgModule({
    declarations: [
        SettingsPageComponent,
        SudoNavComponent,
        AdministrationPageComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ], exports: [
        SudoNavComponent
    ]
})
export class SudoModule { }
