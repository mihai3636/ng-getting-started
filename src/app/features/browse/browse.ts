import { Component, effect, inject, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieService } from '../../core/movie-service';
import { Movie, TmdbResponse } from '../../core/movie.model';
import { MovieCard } from './movie-card';

@Component({
  selector: 'app-browse',
  imports: [MovieCard, MatProgressSpinnerModule, MatPaginatorModule],
  template: `
    <section>
      <div class="container">
        <mat-paginator
          [length]="totalResults()"
          [pageSize]="pageSize()"
          [hidePageSize]="false"
          [showFirstLastButtons]="true"
          (page)="handlePageEvent($event)"
          aria-label="Select page"
        >
        </mat-paginator>

        @if (uiState.error()) {
          <p>{{ uiState.error()?.message }}</p>
        }

        <div class="cards">
          @for (item of movies(); track item.id) {
            <app-movie-card [item]="item" />
          }
        </div>

        @if (uiState.isLoading()) {
          <div class="overlay">
            <mat-spinner class="spinner"></mat-spinner>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .cards {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--sp-7);

      justify-items: center;

      padding-block: var(--sp-7);
    }

    .overlay {
      z-index: 100;
      position: fixed;
      inset: 0;

      display: grid;
      place-content: center;
      background: color-mix(in srgb, var(--mat-sys-surface) 60%, transparent);
    }
  `,
})
export class BrowsePageComponent {
  private movieService = inject(MovieService);
  private currentPage = signal(1);

  protected totalResults = signal(0);
  protected pageSize = signal(0);
  protected movies = signal<Movie[]>([]);

  uiState: ResourceRef<TmdbResponse | undefined> = rxResource<TmdbResponse, number>({
    params: () => this.currentPage(),
    stream: ({ params }) => this.movieService.getTopRatedMovies(params),
  });

  constructor() {
    effect(() => {
      if (!this.uiState.hasValue()) {
        console.log(`Effect has no value`);
        return;
      }

      const value = this.uiState.value();
      console.log('Effect changed: ', value);

      this.totalResults.set(Math.min(value.total_results, 10100));
      this.pageSize.set(value.results.length);
      this.movies.set(value.results);
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.currentPage.set(pageEvent.pageIndex + 1);
  }
}
