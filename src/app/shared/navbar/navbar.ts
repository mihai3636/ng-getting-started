import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  template: ` <section class="section section--header">
    <div class="container">
      <nav class="nav">
        <a class="nav__logo" matButton routerLink="/">
          <mat-icon>star_half</mat-icon>
          Logo
        </a>
        <ul class="nav__links">
          <li>
            <a matButton routerLink="/">Home</a>
          </li>
          <li>
            <a matButton routerLink="/browse">Browse</a>
          </li>
          <li>
            <a matButton routerLink="/">Top Rated</a>
          </li>
          <li>
            <a matButton routerLink="/">Watchlist</a>
          </li>
          <li>
            <a matButton routerLink="/">About</a>
          </li>
        </ul>
      </nav>
    </div>
  </section>`,
  styleUrl: './navbar.scss',
})
export class NavbarComponent {}
