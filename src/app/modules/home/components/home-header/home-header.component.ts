import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { AdminRecommendation } from 'src/app/modules/shared/models/admin-recommendation.interface';
import { RecommendService } from 'src/app/modules/shared/services/recommend-service/recommend.service';
@Component({
    selector: 'app-home-header',
    templateUrl: './home-header.component.html',
    styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent implements OnInit {
    isLoading = true;
    @Output() loadingChange = new EventEmitter<boolean>();

    constructor(
        private readonly recommendService: RecommendService,
        private readonly toastr: ToastrService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

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
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    case 404:
                        if (type == 'movie') this.toastr.info('', 'Film dneva še ni bil nastavljen', { timeOut: timingConst.info });
                        else this.toastr.info('', 'Serija dneva še ni bila nastavljena', { timeOut: timingConst.info });
                        break;
                    default:
                        if (type == 'movie') this.toastr.error('', 'Napaka pri pridobivanju filma dneva', { timeOut: timingConst.error });
                        else this.toastr.error('', 'Napaka pri pridobivanju serije dneva', { timeOut: timingConst.error });
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
                switch (error.status) {
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    default:
                        this.toastr.error('', 'Napaka pri pridobivanju priporočila', { timeOut: timingConst.error });
                        break;
                }
            }
        });
    }

    protected seeMore(section: string) {
        let queryParams = {
            s: section
        }
        this.router.navigate(['/razisci'], { queryParams: queryParams });
    }

    setLoading(isLoading: boolean): void {
        this.isLoading = isLoading;
        this.loadingChange.emit(this.isLoading);
    }
}
