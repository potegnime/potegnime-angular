import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { ApiInterceptor } from '@core/interceptor/api/api.interceptor';
import { ConfigService } from '@core/services/config/config.service';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { ApplicationDataService } from '@core/services/application-data/application-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      const authService = inject(AuthService);
      const applicationDataService = inject(ApplicationDataService);

      return configService.loadConfig().then(() => {
        return firstValueFrom(authService.refreshToken())
          .then(() => {
            // User is authenticated, fetch application data
            return firstValueFrom(applicationDataService.fetchApplicationData());
          })
          .catch((err) => {
            // refresh failed (no valid refresh token or user not authenticated)
            // expected for unauthenticated users accessing public routes
            // silently continue - protected routes will redirect via AuthGuard
            return null;
          });
      });
    }),
    provideToastr(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ]
};
