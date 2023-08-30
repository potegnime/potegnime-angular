import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { SearchBarSearchComponent } from './components/search-bar-search/search-bar-search.component';


@NgModule({
    declarations: [
        SearchPageComponent,
        SearchBarSearchComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class SearchModule { }
