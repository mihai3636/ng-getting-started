import { Routes } from '@angular/router';
import { BrowsePageComponent } from './features/browse/browse';
import { HomePageComponent } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
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
];
