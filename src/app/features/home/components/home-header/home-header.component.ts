import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { timingConst } from '@core/enums/toastr-timing.enum';
import { AdminRecommendation } from '@models/admin-recommendation.interface';
import { RecommendService } from '@shared/services/recommend/recommend.service';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
  standalone: true
})
export class HomeHeaderComponent implements OnInit {
  private readonly recommendService = inject(RecommendService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  protected isLoading: boolean = true;

  @Output() loadingChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.setLoading(false);
  }

  protected searchTitle(text: string): void {
    this.router.navigate(['/iskanje'], { queryParams: { q: text } });
  }

  private getFormattedDate(): string {
    const dateObject = new Date();
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${year}-${month}-${day}`;
  }

  protected searchAdminRecommendationOfTheDay(type: 'movie' | 'series'): void {
    const date = this.getFormattedDate();

    this.recommendService.getAdminRecommendation(date, type).subscribe({
      next: (response: AdminRecommendation) => {
        this.searchTitle(response.name);
        this.setLoading(false);
      },
      error: (error) => {
        switch (error.status) {
          case 404:
            if (type == 'movie')
              this.toastr.info('', 'Film dneva še ni bil nastavljen', {
                timeOut: timingConst.info
              });
            else
              this.toastr.info('', 'Serija dneva še ni bila nastavljena', {
                timeOut: timingConst.info
              });
            break;
          default:
            if (type == 'movie')
              this.toastr.error('', 'Napaka pri pridobivanju filma dneva', {
                timeOut: timingConst.error
              });
            else
              this.toastr.error('', 'Napaka pri pridobivanju serije dneva', {
                timeOut: timingConst.error
              });
            break;
        }
        this.setLoading(false);
      }
    });
  }

  protected searchRandomMovieTitle(): void {
    this.recommendService.getRandomRecommendation().subscribe({
      next: (response: AdminRecommendation) => {
        this.searchTitle(response.name);
        this.setLoading(false);
      },
      error: (error) => {
        this.setLoading(false);
        this.toastr.error('', 'Napaka pri pridobivanju priporočila', {
          timeOut: timingConst.error
        });
      }
    });
  }

  protected seeMore(section: string) {
    let queryParams = {
      s: section
    };
    this.router.navigate(['/razisci'], { queryParams: queryParams });
  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.loadingChange.emit(this.isLoading);
  }
}
