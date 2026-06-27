import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay } from 'rxjs';
import env from '../../../environments/environment';
import { MovieDetails, TmdbResponse } from './movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly url = 'https://api.themoviedb.org/3';
  private headers = {
    accept: 'application/json',
    Authorization: `Bearer ${env.tmdbReadToken}`,
  };
  private httpClient = inject(HttpClient);

  getTopRatedMovies(page: number) {
    console.log(`getTopRatedMovies(${page})`);
    let urlWithPageParam = `${this.url}/movie/top_rated?language=en-US&page=${page}`;

    return this.httpClient.get<TmdbResponse>(urlWithPageParam, { headers: this.headers });
    // .pipe(delay(5000));
    // switchMap(() => throwError(() => new Error('Simulated error'))),
  }

  searchMovies(query: string, page: number) {
    console.log(`searchMovies(query: ${query}, page: ${page})`);

    const searchUrl = `${this.url}/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=${page}`;
    return this.httpClient.get<TmdbResponse>(searchUrl, { headers: this.headers });
  }

  getMovieDetails(id: number) {
    let urlWithId = `${this.url}/movie/${id}?language=en-US`;
    return this.httpClient.get<MovieDetails>(urlWithId, { headers: this.headers }).pipe(
      delay(1000),
      // switchMap(() => throwError(() => new Error('Simulated error'))),
    );
  }
}
