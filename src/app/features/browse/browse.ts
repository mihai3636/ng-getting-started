import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieService } from '../../core/movie-service';
import { MovieCard } from './movie-card';

@Component({
  selector: 'app-browse',
  imports: [MovieCard],
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
          <app-movie-card [item]="item" />
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
