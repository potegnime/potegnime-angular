import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminRecommendation } from '@models/admin-recommendation.interface';
import { RecommendationDto } from '@models/recommendation-dto.interface';
import { BaseHttpService } from '@core/services/base-http/base-http.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendService extends BaseHttpService {
  public setAdminRecommendation(
    recommendationDto: RecommendationDto
  ): Observable<AdminRecommendation> {
    return this.postJson<RecommendationDto, AdminRecommendation>(`recommend`, recommendationDto);
  }

  public getAdminRecommendation(
    date: string,
    type: 'movie' | 'series'
  ): Observable<AdminRecommendation> {
    return this.getJson<AdminRecommendation>(`recommend?date=${date}&type=${type}`);
  }

  public deleteAdminRecommendation(date: string, type: 'movie' | 'series'): Observable<any> {
    return this.deleteJson<any, any>(`recommend?date=${date}&type=${type}`);
  }
}
