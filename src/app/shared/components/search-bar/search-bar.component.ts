import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SearchService } from '@features/search/services/search/search.service';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [ReactiveFormsModule],
  standalone: true
})
export class SearchBarComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly searchService = inject(SearchService);

  searchForm!: FormGroup;

  public ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      query: ['', Validators.required]
    });

    this.route.queryParamMap.subscribe((params) => {
      const query = params.get('q') || '';
      this.searchForm.patchValue({ query });
    });
  }

  protected onSearch(): void {
    // Use search service onSearch method
    if (!this.searchForm.valid) {
      this.toastService.showWarning('Vnesite izraz za iskanje');
      return;
    }

    // Use search service onSearch method
    this.searchService.onSearchComponent(this.searchForm.value.query, null, null, null, null);
  }
}
