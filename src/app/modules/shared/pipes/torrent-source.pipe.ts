import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'torrentSource'
})
export class TorrentSourcePipe implements PipeTransform {

    transform(value: string): string {
        switch (value) {
            case 'thepiratebay':
                return 'ThePirateBay';
            case 'yts':
                return 'YTS';
            case 'eztv':
                return 'EZTV';
            case 'torrentproject':
                return 'TorrentProject';
        }
        return value;
    }
}
