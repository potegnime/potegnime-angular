import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@core/services/toast/toast.service';

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
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected isLoading: boolean = true;

  @Output() loadingChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.setLoading(false);
  }

  protected searchTitle(text: string): void {
    this.router.navigate(['/search'], { queryParams: { q: text } });
  }

  private getFormattedDate(): string {
    const dateObject = new Date();
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${year}-${month}-${day}`;
  }

  protected searchAdminRecommendationOfTheDay(type: 'movie' | 'series'): void {
    this.setLoading(true);
    setTimeout(() => {
          this.recommendService.getAdminRecommendation(date, type).subscribe({
      next: (response: AdminRecommendation) => {
        this.searchTitle(response.name);
        this.setLoading(false);
      },
      error: (error) => {
        switch (error.status) {
          case 404:
            if (type == 'movie')
              this.toastService.showInfo('Film dneva še ni bil nastavljen');
            else
              this.toastService.showInfo('Serija dneva še ni bila nastavljena');
            break;
        }
        this.setLoading(false);
      }
    });
    }, 5000);
    const date = this.getFormattedDate();


  }

  protected searchRandomMovieTitle(): void {
    this.setLoading(true);
    this.recommendService.getRandomRecommendation().subscribe({
      next: (response: AdminRecommendation) => {
        this.searchTitle(response.name);
        this.setLoading(false);
      },
      error: (error) => {
        this.setLoading(false);
      }
    });
  }

  protected seeMore(section: string) {
    this.setLoading(true);
    this.router.navigate(['/explore'], { queryParams: { s: section } });
  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.loadingChange.emit(this.isLoading);
  }
}
