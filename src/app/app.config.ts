import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
};

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const firestore = getFirestore(app);
