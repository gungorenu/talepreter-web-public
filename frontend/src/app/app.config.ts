import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withIncrementalHydration()),
    // TODO: interceptors break build with withFetch, so use either of one
    provideHttpClient(withFetch() /*, withInterceptors([jwtInterceptor])*/),
  ],
};
