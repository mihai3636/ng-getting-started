import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth';

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

        @if (authService.currentUser()) {
          <ul class="nav__links">
            <li>
              <a matButton routerLink="/home">Home</a>
            </li>
            <li>
              <a matButton routerLink="/browse" [queryParams]="{ page: 1, q: '' }">Browse</a>
            </li>
            <!-- <li>
              <a matButton routerLink="/">Top Rated</a>
            </li>
            <li>
              <a matButton routerLink="/">Watchlist</a>
            </li> -->
            <li>
              <a matButton routerLink="/profile">Profile</a>
            </li>
            <li>
              <button matButton (click)="logOut()">Log out</button>
            </li>
          </ul>
        }
      </nav>
    </div>
  </section>`,
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  protected readonly authService = inject(Auth);
  private readonly router = inject(Router);

  logOut() {
    console.log(`Logout clicked`);
    this.authService.logOut().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        console.log(`Logout success`);
      },
      error: (err) => {
        console.log(`authService.logOut something went wrong`, err.message);
      },
    });
  }
}
