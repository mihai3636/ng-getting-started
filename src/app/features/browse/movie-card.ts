import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Movie } from '../../core/movie.model';

@Component({
  selector: 'app-movie-card',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  template: `
    <mat-card class="card" appearance="outlined">
      <img
        mat-card-image
        [src]="'https://image.tmdb.org/t/p/w342' + item().poster_path"
        [alt]="item().title"
        width="342"
        height="513"
      />
      <mat-card-content>
        <p class="mat-font-body-lg">
          {{ item().overview }}
        </p>
      </mat-card-content>
      <mat-card-actions align="end">
        <a [routerLink]="['/movie', item().id]" matButton>More info</a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    :host {
      display: contents;
    }

    .card {
      max-width: 344px;
    }

    mat-card-content {
      padding-top: var(--sp-4);
    }

    mat-card-actions {
      margin-top: auto;
      --mat-card-actions-padding: var(--sp-5);
    }
  `,
})
export class MovieCard {
  item = input.required<Movie>();
}
