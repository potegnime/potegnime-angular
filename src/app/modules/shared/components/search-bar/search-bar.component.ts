import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      query: [this.route.snapshot.queryParamMap.get('q') || '', Validators.required]
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