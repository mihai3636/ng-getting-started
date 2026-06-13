import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieService } from '../../core/movie-service';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-browse',
  imports: [MatCardModule, MatButtonModule],
  template: `
    <section>
      <div class="container cards">
        @if (movieState().loading) {
          <p>Movie is loading</p>
        }

        @if (movieState().error) {
          <p>{{ movieState().error }}</p>
        }

        @for (item of movieState().data; track $index) {
          <mat-card class="card" appearance="outlined">
            <img
              class="card__img"
              mat-card-image
              [src]="'https://image.tmdb.org/t/p/w342' + item.poster_path"
              [alt]="item.title"
              width="342"
              height="513"
            />
            <mat-card-content>
              <p class="mat-font-body-lg">
                {{ item.overview }}
              </p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </section>
  `,
  styles: `
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--sp-7);

      justify-items: center;

      padding-block: var(--sp-7);
    }

    .card {
      max-width: 342px;
    }

    .card__img {
      //   object-fit: cover;
      //   object-position: top;
    }

    mat-card-content {
      padding-top: var(--sp-4);
    }
  `,
})
export class BrowsePageComponent {
  private movieService = inject(MovieService);

  movieState = toSignal(this.movieService.getTopRatedMovies(), { requireSync: true });

  constructor() {
    console.log('BrowserPageComponent constructor called');
    console.log(this.movieState());
  }
}
