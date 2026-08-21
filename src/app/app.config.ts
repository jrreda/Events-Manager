import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { API_URL } from './core/tokens';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),

    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),

    provideHttpClient(withFetch()),

    // We only provide the BASE url.
    // The TICKETS_URL is 'providedIn: root' via its factory.
    { provide: API_URL, useValue: 'http://localhost:3000' }, provideClientHydration(withEventReplay()),
  ],
};
