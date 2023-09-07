import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { SudoModule } from './modules/sudo/sudo.module';
import { SearchModule } from './modules/search/search.module';
import { DetailsModule } from './modules/details/details.module';
import { SharedModule } from './modules/shared/shared.module';
import { AboutModule } from './modules/about/about.module';
import { JwtModule } from '@auth0/angular-jwt';

import { urlConst } from './modules/shared/enums/url.enum';
import { ToastrModule } from 'ngx-toastr';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [`${urlConst.appBase}`],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    AuthModule,
    SudoModule,
    DetailsModule,
    SharedModule,
    AboutModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
