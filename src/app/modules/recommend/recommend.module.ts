import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendPageComponent } from './components/recommend-page/recommend-page.component';
import { RecommendRoutingModule } from './recommend-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    RecommendPageComponent
  ],
  imports: [
    CommonModule,
    RecommendRoutingModule,
    SharedModule
  ]
})
export class RecommendModule { }
