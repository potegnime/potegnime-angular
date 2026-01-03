import { Injectable } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http/base-http.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApplicationData } from '@models/application-data.interface';
import { UserModel } from '@models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ApplicationDataService extends BaseHttpService {
  private applicationDataSubject = new BehaviorSubject<ApplicationData | undefined>(undefined);
  private userSubject = new BehaviorSubject<UserModel | undefined>(undefined);

  public applicationData$ = this.applicationDataSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  public fetchApplicationData(): Observable<ApplicationData> {
    return this.getJson<ApplicationData>('application').pipe(
      tap((data) => {
        this.applicationDataSubject.next(data);
        const user: UserModel = {
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          joined: data.user.joined,
          hasPfp: data.user.hasPfp ?? false
        };
        this.userSubject.next(user);
      })
    );
  }

  public getApplicationData(): ApplicationData | undefined {
    return this.applicationDataSubject.value;
  }

  public getUser(): UserModel | undefined {
    return this.userSubject.value;
  }

  public clearApplicationData(): void {
    this.applicationDataSubject.next(undefined);
    this.userSubject.next(undefined);
  }
}
