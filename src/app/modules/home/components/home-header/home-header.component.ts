import { Component } from '@angular/core';
import { TorrentService } from 'src/app/modules/shared/services/torrent-service/torrent.service';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent {
  constructor(private torrentService: TorrentService) {
    
  }

  // async searchTorrents(query: string, category: string, limit: number) {
  //   try {
  //     const torrents = await this.torrentService.searchTorrents(query, category, limit);
  //     // Do something with torrents (e.g., display them in your component)
  //     console.log(torrents);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}
