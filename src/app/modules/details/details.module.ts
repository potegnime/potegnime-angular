import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsPageComponent } from './components/details-page/details-page.component';
import { DetailsHeadComponent } from './components/details-head/details-head.component';
import { DetailsDescComponent } from './components/details-desc/details-desc.component';


@NgModule({
  declarations: [
    DetailsPageComponent,
    DetailsHeadComponent,
    DetailsDescComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DetailsModule { }
