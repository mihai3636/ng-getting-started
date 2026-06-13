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
        @for (item of movies(); track $index) {
          <p>{{ item.title }}</p>
        }
      </div>
    </section>
  `,
  styles: ``,
})
export class BrowsePageComponent {
  private movieService = inject(MovieService);

  movies = toSignal(this.movieService.getTopRatedMovies(), { initialValue: [] as Movie[] });

  constructor() {
    console.log('BrowserPageComponent constructor called');
    console.log(this.movies());
  }
}
