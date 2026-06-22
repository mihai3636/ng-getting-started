import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import environment from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideHttpClient()],
};

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
