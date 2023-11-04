import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searchForm!: FormGroup;
  private routeSubscription!: Subscription;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      query: ['', Validators.required]
    });

    this.routeSubscription = this.route.queryParamMap.subscribe(params => {
      const query = params.get('q') || '';
      this.searchForm.patchValue({ query });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
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