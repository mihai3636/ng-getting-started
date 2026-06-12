import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home';
import { BrowsePageComponent } from './features/browse/browse';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'browse',
    component: BrowsePageComponent,
  },
];
