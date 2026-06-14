import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieService } from '../../core/movie-service';
import { MovieCard } from './movie-card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-browse',
  imports: [MovieCard, MatProgressSpinnerModule, MatPaginatorModule],
  template: `
    <section>
      <div class="container">
        <mat-paginator
          [length]="movieState().total_results"
          [pageSize]="movieState().data.length"
          [hidePageSize]="false"
          [showFirstLastButtons]="true"
          (page)="handlePageEvent($event)"
          aria-label="Select page"
        >
        </mat-paginator>

        <div class="cards">
          @if (movieState().loading) {
            <mat-spinner></mat-spinner>
          }

          @if (movieState().error) {
            <p>{{ movieState().error }}</p>
          }
          @for (item of movieState().data; track $index) {
            <app-movie-card [item]="item" />
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

  movieState = toSignal(this.movieService.getTopRatedMovies(), { requireSync: true });

  constructor() {
    console.log('BrowserPageComponent constructor called');
    console.log(this.movieState());
  }

  handlePageEvent(pageEvent: PageEvent) {
    console.log(`Page event happened: `, pageEvent);
  }
}
