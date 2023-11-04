import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'torrentSource'
})
export class TorrentSourcePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case '_1337x':
        return '1337x';
      case 'thePirateBay':
        return 'ThePirateBay';
      case 'yts':
        return 'YTS';
    }
    return value;
  }

}
