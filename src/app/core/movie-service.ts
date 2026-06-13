import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import env from '../../environments/environment';
import { catchError, map, Observable, startWith, of, delay, throwError, switchMap } from 'rxjs';
import { TmdbResponse, Movie, MovieState } from './movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
  private headers = {
    accept: 'application/json',
    Authorization: `Bearer ${env.tmdbReadToken}`,
  };
  private httpClient = inject(HttpClient);

  getTopRatedMovies(): Observable<MovieState> {
    console.log(this.headers);
    return this.httpClient
      .get<TmdbResponse>(this.url, {
        headers: this.headers,
      })
      .pipe(
        delay(3000),
        map((response) => {
          throw new Error('Something went wrong');
          return {
            data: response.results,
            loading: false,
            error: null,
          };
        }),
        startWith({
          data: [],
          loading: true,
          error: null,
        }),
        catchError((err) =>
          of({
            data: [],
            loading: false,
            error: err.message,
          }),
        ),
      );
  }
}
