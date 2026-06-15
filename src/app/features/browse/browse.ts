import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieService } from '../../core/movie-service';
import { TmdbResponse } from '../../core/movie.model';
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

        <div class="cards">
          @if (uiState.isLoading()) {
            <mat-spinner></mat-spinner>
          } @else if (uiState.error()) {
            <p>{{ uiState.error()?.message }}</p>
          } @else {
            @for (item of movies(); track item.id) {
              <app-movie-card [item]="item" />
            }
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--sp-7);

      justify-items: center;

      padding-block: var(--sp-7);
    }

    mat-paginator {
      // display: inline-block;
    }
  `,
})
export class BrowsePageComponent {
  private movieService = inject(MovieService);
  private currentPage = signal(1);

  protected totalResults = signal(0);
  protected pageSize = signal(0);

  protected movies = computed(() => this.uiState.value()?.results ?? []);

  uiState = rxResource<TmdbResponse, number>({
    params: () => this.currentPage(),
    stream: ({ params }) => this.movieService.getTopRatedMovies(params),
  });

  constructor() {
    effect(() => {
      const value = this.uiState.value();
      if (value) {
        this.totalResults.set(Math.min(value.total_results, 10000));
        this.pageSize.set(value.results.length);
      }
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    let newPage = pageEvent.pageIndex + 1;
    this.currentPage.set(newPage);
  }
}
