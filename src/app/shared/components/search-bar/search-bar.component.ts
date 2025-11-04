import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/features/search/services/search/search.service';
import { timingConst } from '../../../core/enums/toastr-timing.enum';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    imports: [ReactiveFormsModule],
    standalone: true
})
export class SearchBarComponent implements OnInit {
    private readonly formBuilder = inject(FormBuilder);
    private readonly toastr = inject(ToastrService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);

    searchForm!: FormGroup;

    public ngOnInit(): void {
        this.searchForm = this.formBuilder.group({
            query: ['', Validators.required]
        });

        this.route.queryParamMap.subscribe(params => {
            const query = params.get('q') || '';
            this.searchForm.patchValue({ query });
        });
    }


    protected onSearch(): void {
        // Use search service onSearch method
        if (!this.searchForm.valid) {
            this.toastr.warning('', 'Vnesite izraz za iskanje', { timeOut: timingConst.warning });
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