import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';

@NgModule({
    declarations: [
        AuthPageComponent,
        LoginFormComponent,
        RegisterFormComponent,
        ForgotPasswordFormComponent,
        ResetPasswordFormComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule
    ]
})
export class AuthModule { }
