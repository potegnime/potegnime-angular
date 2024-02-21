import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SortService {
    private sortSource = new BehaviorSubject<string>('default');
    currentSort = this.sortSource.asObservable();

    constructor() { }

    changeSort(sort: string) {
        this.sortSource.next(sort);
    }
}
