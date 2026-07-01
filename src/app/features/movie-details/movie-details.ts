import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MovieService } from '../../core/movies/movie-service';
import { MovieDetails } from '../../core/movies/movie.model';

@Component({
  selector: 'app-movie-details',
  imports: [MatProgressSpinnerModule, DatePipe, MatChipsModule],
  template: `
    <section>
      <div class="container">
        @if (movieDetailsResource.error()) {
          <p>Something went wrong, message: {{ movieDetailsResource.error()?.message }}</p>
          <p>Something went wrong, cause: {{ movieDetailsResource.error()?.cause }}</p>
        }
        @if (movieDetailsResource.isLoading()) {
          <mat-spinner class="spinner"></mat-spinner>
        }
        @if (movieDetails(); as movie) {
          <!-- <p>Printing movie details</p>

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
          /> -->

          <div class="details">
            <img
              class="details__img"
              [src]="'https://image.tmdb.org/t/p/w342' + movie.poster_path"
              [alt]="movie.title"
            />
            <div class="details__info flow-content">
              <h1 class="details__title mat-font-display-sm">{{ movie.title }}</h1>

              <div class="details__subtitle">
                <p class="details__date">{{ movie.release_date | date: 'yyyy' }}</p>

                <mat-chip-set aria-label="Genres">
                  @for (genre of movie.genres; track genre.id) {
                    <mat-chip>{{ genre.name }}</mat-chip>
                  }
                </mat-chip-set>
              </div>

              <p class="details__overview mat-font-body-lg">{{ movie.overview }}</p>
              <q class="details__tagline">{{ movie.tagline }}</q>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    @use '@angular/material' as mat;

    .container {
      padding-block: var(--sp-7);
    }

    .spinner {
      position: fixed;
      z-index: 200;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    }

    .details {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: var(--sp-8);
      // outline: 1px solid red;

      @include mat.elevation(4);
      border-radius: var(--mat-sys-corner-medium);
      overflow: hidden;
    }

    .details__subtitle {
      display: flex;
      align-items: center;
      gap: var(--sp-5);
    }

    .details__info {
      max-width: 70%;
      padding-block: var(--sp-5);

      display: flex;
      flex-direction: column;
    }

    .details__subtitle {
      --flow-spacer: var(--sp-1);
    }

    .details__overview {
      --flow-spacer: var(--sp-4);
    }

    .details__tagline {
      margin-top: auto;
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
