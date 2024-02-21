import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecommendPageComponent } from './components/recommend-page/recommend-page.component';

const routes: Routes = [
    { path: '', component: RecommendPageComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecommendRoutingModule { }