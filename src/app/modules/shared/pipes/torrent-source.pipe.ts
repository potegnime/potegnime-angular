import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'torrentSource'
})
export class TorrentSourcePipe implements PipeTransform {

    transform(value: string): string {
        switch (value) {
            case 'thePirateBay':
                return 'ThePirateBay';
            case 'yts':
                return 'YTS';
            case 'torrentProject':
                return 'TorrentProject';
        }
        return value;
    }

}
