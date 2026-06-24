import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import environment from '../environments/environment';
import { Auth } from './core/auth/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      return inject(Auth).whenReady();
    }),
  ],
};

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
