import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    public cache = new Map<string, Blob>();

    constructor() { }

    get(key: string): Blob | undefined {
        return this.cache.get(key);
    }

    put(key: string, value: Blob): void {
        this.cache.set(key, value);
    }
}
