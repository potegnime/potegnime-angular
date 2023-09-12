import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { DonatePageComponent } from './components/donate-page/donate-page.component';



@NgModule({
  declarations: [
    AboutPageComponent,
    DonatePageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AboutModule { }
