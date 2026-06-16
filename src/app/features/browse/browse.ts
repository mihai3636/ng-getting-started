import { Component, effect, inject, ResourceRef, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { MovieService } from '../../core/movie-service';
import { Movie, TmdbResponse } from '../../core/movie.model';
import { MovieCard } from './movie-card';

@Component({
  selector: 'app-browse',
  imports: [MovieCard, MatProgressSpinnerModule, MatPaginatorModule, MatCardModule],
  template: `
    <section>
      <div class="container">
        <mat-paginator
          [length]="totalResults()"
          [pageSize]="pageSize()"
          [pageIndex]="currentPage() - 1"
          [hidePageSize]="false"
          [showFirstLastButtons]="true"
          (page)="handlePageEvent($event)"
          aria-label="Select page"
        >
        </mat-paginator>

        @if (uiState.error()) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>Error</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ uiState.error()?.message }}</p>
            </mat-card-content>
          </mat-card>
        }

        <div class="cards">
          @for (item of movies(); track item.id) {
            <app-movie-card [item]="item" />
          }
        </div>

        @if (uiState.isLoading()) {
          <div class="section__overlay"></div>
          <mat-spinner class="spinner"></mat-spinner>
        }
      </div>
    </section>
  `,
  styles: `
    section {
      position: relative;
    }

    .cards {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--sp-7);

      justify-items: center;

      padding-block: var(--sp-7);
    }

    .section__overlay {
      z-index: 100;
      position: absolute;
      inset: 0;
      background: color-mix(in srgb, var(--mat-sys-surface) 60%, transparent);
    }

    .spinner {
      position: fixed;
      z-index: 200;
      top: 50%;
      left: 50%;
      transform: trnaslateY(-50%) translateX(-50%);
    }

    mat-card-content {
      padding-top: var(--sp-2);
    }
  `,
})
export class BrowsePageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  private pageParam$ = this.route.queryParamMap.pipe(
    map((params) => Math.max(1, Number(params.get('page')))),
  );

  protected currentPage = toSignal(this.pageParam$, { requireSync: true });

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

    effect(() => {
      if (this.uiState.error()) {
        this.movies.set([]);
      }
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.router.navigate([], {
      queryParams: { page: pageEvent.pageIndex + 1 },
      queryParamsHandling: 'merge',
    });
  }
}
