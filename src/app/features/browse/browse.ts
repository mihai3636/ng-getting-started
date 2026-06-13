import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieService } from '../../core/movie-service';
import { Movie } from '../../core/movie.model';

@Component({
  selector: 'app-browse',
  imports: [],
  template: `
    <section>
      <div class="container">
        <p>Browse component works!</p>
        @if (movieState().loading) {
          <p>Movie is loading</p>
        }

        @if (movieState().error) {
          <p>{{ movieState().error }}</p>
        }

        @for (item of movieState().data; track $index) {
          <p>{{ item.title }}</p>
        }
      </div>
    </section>
  `,
  styles: ``,
})
export class BrowsePageComponent {
  private movieService = inject(MovieService);

  movieState = toSignal(this.movieService.getTopRatedMovies(), { requireSync: true });

  constructor() {
    console.log('BrowserPageComponent constructor called');
    console.log(this.movieState());
  }
}
