import { Component, effect, inject, ResourceRef, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map, tap } from 'rxjs';
import { MovieService } from '../../core/movies/movie-service';
import { Movie, TmdbResponse } from '../../core/movies/movie.model';
import { MovieCard } from './movie-card';

interface SearchData {
  query: string;
}

@Component({
  selector: 'app-browse',
  imports: [
    MovieCard,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatCardModule,
    FormField,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
  ],
  template: `
    <section>
      <div class="container">
        <div class="header">
          <form action="#">
            <mat-form-field>
              <mat-label>Search</mat-label>
              <input matInput type="text" [formField]="searchForm.query" />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </form>

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
        </div>

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
    @use '../../../partials/variables' as *;
    section {
      position: relative;
    }

    .container {
      padding-top: var(--sp-5);
    }

    .header {
      display: flex;
      justify-content: space-between;
    }

    mat-form-field {
      min-width: 500px;
    }

    .cards {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--sp-7);

      justify-items: center;

      // @media (min-width: $bp-tablet) {
      //   justify-items: start;
      // }

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
      transform: translateY(-50%) translateX(-50%);
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
    tap((params) =>
      console.log(`tapping on page param`, Number(params.get('page')), params.get('page')),
    ),
    map((params) => Math.max(1, Number(params.get('page')))),
  );

  private queryParam$ = this.route.queryParamMap.pipe(
    tap((params) => console.log(`tapping on query param`, params.get('q'))),
    map((params) => params.get('q') ?? ''),
  );

  protected currentPage = toSignal(this.pageParam$, { requireSync: true });
  protected currentQuery = toSignal(this.queryParam$, { requireSync: true });

  protected totalResults = signal(0);
  protected pageSize = signal(0);
  protected movies = signal<Movie[]>([]);

  readonly searchModel = signal<SearchData>({
    query: '',
  });

  readonly searchForm = form(this.searchModel);

  private formQuery$ = toObservable(this.searchForm.query().value).pipe(debounceTime(500));
  private formQuery = toSignal(this.formQuery$, { initialValue: '' });

  uiState: ResourceRef<TmdbResponse | undefined> = rxResource({
    params: () => ({ page: this.currentPage(), query: this.currentQuery() }),
    stream: ({ params }) =>
      params.query
        ? this.movieService.searchMovies(params.query, params.page)
        : this.movieService.getTopRatedMovies(params.page),
  });

  constructor() {
    effect(() => {
      if (!this.uiState.hasValue()) {
        console.log(`Effect has no value`);
        return;
      }

      const value = this.uiState.value();
      console.log('Effect changed: ', value);

      if (!value) return;

      this.totalResults.set(Math.min(value.total_results, 10100));
      this.pageSize.set(value.results.length);
      this.movies.set(value.results);
    });

    effect(() => {
      if (this.uiState.error()) {
        this.movies.set([]);
      }
    });

    effect(() => {
      console.log(`Effect formQuery(): `, this.formQuery());

      this.router.navigate([], {
        queryParams: { page: 1, q: this.formQuery() },
        queryParamsHandling: 'merge',
      });
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.router.navigate([], {
      queryParams: { page: pageEvent.pageIndex + 1 },
      queryParamsHandling: 'merge',
    });
  }
}
