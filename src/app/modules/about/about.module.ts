import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { DonatePageComponent } from './components/donate-page/donate-page.component';



@NgModule({
  declarations: [
    AboutPageCmponent,
    DonatePageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AboutModule { }
