import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search-service/search.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  searchForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {
    this.searchForm = this.formBuilder.group({
      query: ['']
    });
  }

  onSearch(): void {
    if (!this.searchForm.valid) {
      this.toastr.warning('', 'Vnesite izraz za iskanje', {timeOut: 2000});
      return;
    }
    const query = this.searchForm.value.query;
    this.router.navigate(['/iskanje'], { queryParams: { q: query } });

    // let encodedQuery = encodeURI(query);


    // encodedQuery = encodedQuery.trim();

    // this.searchService.search(query).subscribe((results) => {
    //   // Assuming you have a route named 'search-results'
    //   this.router.navigate(['/search-results'], { queryParams: { q: query } });
    // });
  }
}
