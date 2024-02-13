import { Component } from '@angular/core';
import { RecommendService } from 'src/app/modules/shared/services/recommend-service/recommend.service';

@Component({
    selector: 'app-home-torrent',
    templateUrl: './home-torrent.component.html',
    styleUrls: ['./home-torrent.component.scss']
})
export class HomeTorrentComponent {
    
    constructor(
        private readonly recommendService: RecommendService
    ) {
        this.recommendService.trendingMovie('day', 'en-US').subscribe((response: any) => {
            console.log(response);
        });
    }
}
