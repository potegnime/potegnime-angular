import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ApiType } from '@core/enums/api-type.enum';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private config: any | null = null;

  async loadConfig(): Promise<void> {
    const path = 'assets/config.json';
    this.config = await firstValueFrom(this.http.get(path));
  }

  getSection<T>(key: string): T {
    let section: any = this.config;

    key.split(':').forEach((keyPart: string): void => {
      if (section !== undefined) {
        section = section[keyPart];
      }
    });

    return section;
  }

  getAll(): any | null {
    return this.config;
  }

  public getApiUrl(apiType: ApiType): string {
    const envKey = environment.production ? 'production' : 'development';
    switch (apiType) {
      case ApiType.Api:
        return this.getSection<string>(`api:${envKey}`);
      case ApiType.Scraper:
        return this.getSection<string>(`scraper:${envKey}`);
    }
  }
}
