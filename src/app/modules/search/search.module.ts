import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SearchBarSearchComponent } from './components/search-bar-search/search-bar-search.component';
import { AboutResultsComponent } from './components/about-results/about-results.component';


@NgModule({
    declarations: [
        SearchResultsComponent,
        SearchBarSearchComponent,
        AboutResultsComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class SearchModule { }
