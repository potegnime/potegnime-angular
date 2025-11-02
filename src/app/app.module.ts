import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { SudoModule } from './modules/sudo/sudo.module';
import { SharedModule } from './modules/shared/shared.module';
import { AboutModule } from './modules/about/about.module';
import { JwtModule } from '@auth0/angular-jwt';

import { ToastrModule } from 'ngx-toastr';
import { ConfigService } from './core/services/config/config.service';
import { ApiInterceptor } from './core/interceptor/api/api.interceptor';

export function initConfig(config: ConfigService) {
    return () => config.loadConfig();
}

export function tokenGetter() {
    return localStorage.getItem('token');
}

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        RouterModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ['https://potegni.me'],
            },
        }),
        AuthModule,
        SudoModule,
        SharedModule,
        AboutModule,
        FormsModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        ReactiveFormsModule], providers: [
        provideAppInitializer(() => {
        const initializerFn = (initConfig)(inject(ConfigService));
        return initializerFn();
      }),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
