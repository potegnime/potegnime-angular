import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { ApiInterceptor } from '@core/interceptor/api/api.interceptor';
import { provideToastr } from 'ngx-toastr';
import { ConfigService } from '@core/services/config/config.service';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { firstValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      const authService = inject(AuthService);
      return configService.loadConfig().then(() => {
        return firstValueFrom(
          authService.refreshToken()
        ).catch((err) => {
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
