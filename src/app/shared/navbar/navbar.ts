import { Component, inject, signal } from '@angular/core';
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
          <ul class="nav__links" [class.open]="menuOpen()">
            <li>
              <a matButton routerLink="/home" (click)="menuOpen.set(false)">Home</a>
            </li>
            <li>
              <a
                matButton
                routerLink="/browse"
                [queryParams]="{ page: 1, q: '' }"
                (click)="menuOpen.set(false)"
                >Browse</a
              >
            </li>
            <!-- <li>
              <a matButton routerLink="/">Top Rated</a>
            </li>
            <li>
              <a matButton routerLink="/">Watchlist</a>
            </li> -->
            <li>
              <a matButton routerLink="/clients/new">Add client</a>
            </li>
            <li>
              <a matButton routerLink="/profile" (click)="menuOpen.set(false)">Profile</a>
            </li>
            <li>
              <button matButton (click)="logOut()" (click)="menuOpen.set(false)">Log out</button>
            </li>
          </ul>
          <button class="menu" matIconButton (click)="menuOpen.set(!menuOpen())">
            <mat-icon>menu</mat-icon>
          </button>
        }
      </nav>
    </div>
  </section>`,
  styles: `
    @use '../../../partials/variables' as *;
    @use '../../../partials/utils' as *;

    .section--header {
      background-color: var(--mat-sys-primary-container);
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding-block: var(--sp-3);
    }

    .nav__logo {
      --size: 40px;

      mat-icon {
        width: var(--size);
        height: var(--size);
        font-size: var(--size);
      }
    }

    .nav__links {
      position: fixed;
      z-index: 200;
      inset: 0;
      left: 40%;
      background-color: var(--mat-sys-primary-container);

      display: flex;
      flex-direction: column;
      gap: var(--sp-5);

      padding-top: var(--sp-9);
      padding-inline: var(--sp-5);
      transform: translateX(100%);
      transition: transform 0.3s;

      &.open {
        transform: translateX(0);
      }

      @media (min-width: $bp-desktop) {
        display: flex;
        flex-direction: row;
        gap: var(--sp-3);
        padding: 0;

        position: static;
        transform: none;
      }
    }

    .menu {
      position: relative;
      z-index: 300;
      @media (min-width: $bp-desktop) {
        display: none;
      }
    }
  `,
})
export class NavbarComponent {
  protected readonly authService = inject(Auth);
  private readonly router = inject(Router);
  protected menuOpen = signal(false);

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
