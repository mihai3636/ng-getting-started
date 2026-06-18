import { Component, computed, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MovieService } from '../../core/movie-service';
import { MovieDetails } from '../../core/movie.model';

@Component({
  selector: 'app-movie-details',
  imports: [MatProgressSpinnerModule],
  template: `
    <section>
      <div class="container">
        <h1>Movie details works! Here is the id: {{ paramId() }}</h1>

        @if (movieDetailsResource.error()) {
          <p>Something went wrong, message: {{ movieDetailsResource.error()?.message }}</p>
          <p>Something went wrong, cause: {{ movieDetailsResource.error()?.cause }}</p>
        }
        @if (movieDetailsResource.isLoading()) {
          <mat-spinner class="spinner"></mat-spinner>
        }
        @if (movieDetails(); as movie) {
          <p>Printing movie details</p>

          <p>{{ movie.title }}</p>
          <p>{{ movie.tagline }}</p>
          <p>{{ movie.overview }}</p>
          <p>{{ movie.poster_path }}</p>
          <p>{{ movie.backdrop_path }}</p>
          <p>{{ movie.release_date }}</p>

          <p>{{ movie.runtime }}</p>
          <p>{{ movie.vote_average }}</p>
          <p>{{ movie.vote_count }}</p>
          <p>{{ movie.budget }}</p>
          <p>{{ movie.revenue }}</p>

          <img [src]="'https://image.tmdb.org/t/p/w342' + movie.poster_path" [alt]="movie.title" />
          <img
            [src]="'https://image.tmdb.org/t/p/w342' + movie.backdrop_path"
            [alt]="movie.title"
          />
        }
      </div>
    </section>
  `,
  styles: `
    .spinner {
      position: fixed;
      z-index: 200;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    }
  `,
})
export default class MovieDetailsComponent {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  private paramId$ = this.route.paramMap.pipe(map((params) => Number(params.get('id'))));

  protected paramId = toSignal(this.paramId$, { requireSync: true });

  protected movieDetailsResource = rxResource({
    params: () => ({ id: this.paramId() }),
    stream: ({ params }) => this.movieService.getMovieDetails(params.id),
  });

  protected movieDetails = computed<MovieDetails | null>(() => {
    try {
      return this.movieDetailsResource.value() ?? null;
    } catch {
      console.log('Got error');
      return null;
    }
  });

  constructor() {
    effect(() => {
      console.log(`ParamId is: `, this.paramId());
    });
  }
}
