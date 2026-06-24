import { Routes } from '@angular/router';
import { authGuard, authReverseGuard } from './core/auth/auth.guard';
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
    canActivate: [authGuard],
  },
  {
    path: 'browse',
    component: BrowsePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./features/movie-details/movie-details'),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: AuthPage,
    canActivate: [authReverseGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
