import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-bar-search',
  templateUrl: './search-bar-search.component.html',
  styleUrls: ['./search-bar-search.component.scss']
})
export class SearchBarSearchComponent implements OnInit {
  searchForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // Default values for search form
    this.searchForm = this.formBuilder.group({
      query: [this.route.snapshot.queryParamMap.get('q') || '', Validators.required],
      category: ['all'],
      source: ['all'],
      sort: ['default']
    });

    this.route.queryParamMap.subscribe(params => {
      const query = params.get('q') || '';
      this.searchForm.patchValue({ query });
    });
  }

  onSearch(): void {
    if (!this.searchForm.valid) {
      this.toastr.warning('', 'Vnesite izraz za iskanje', {timeOut: 2000});
      return;
    }
    const query = this.searchForm.value.query;
    this.router.navigate(['/iskanje'], { queryParams: { q: query } });
  }
}
