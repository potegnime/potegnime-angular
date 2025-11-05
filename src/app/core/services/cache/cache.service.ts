import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  public cache = new Map<string, Blob>();

  public get(key: string): Blob | undefined {
    return this.cache.get(key);
  }

  public put(key: string, value: Blob): void {
    this.cache.set(key, value);
  }
}
