import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/modules/search/services/search.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
    searchForm!: FormGroup;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly toastr: ToastrService,
        private readonly route: ActivatedRoute,
        private readonly searchService: SearchService
    ) { }

    ngOnInit(): void {
        this.searchForm = this.formBuilder.group({
            query: ['', Validators.required]
        });

        this.route.queryParamMap.subscribe(params => {
            const query = params.get('q') || '';
            this.searchForm.patchValue({ query });
        });
    }


    onSearch(): void {
        // Use search service onSearch method
        if (!this.searchForm.valid) {
            this.toastr.warning('', 'Vnesite izraz za iskanje', { timeOut: 2000 });
            return;
        }

        // Use search service onSearch method
        this.searchService.onSearchComponent(
            this.searchForm.value.query,
            null,
            null,
            null,
            null
        );
    }
}