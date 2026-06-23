import { Routes } from '@angular/router';
import AuthPage from './features/auth/auth';
import { BrowsePageComponent } from './features/browse/browse';
import { HomePageComponent } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'browse',
    component: BrowsePageComponent,
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./features/movie-details/movie-details'),
  },
  {
    path: 'login',
    component: AuthPage,
  },
];
