import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import env from '../../environments/environment';
import { TmdbResponse } from './movie.model';

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

    return this.httpClient
      .get<TmdbResponse>(urlWithPageParam, { headers: this.headers })
      .pipe
      // delay(200),
      // switchMap(() => throwError(() => new Error('Simulated error'))),
      ();
  }

  searchMovies(query: string, page: number) {
    const searchUrl = `${this.url}/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=${page}`;
    return this.httpClient.get<TmdbResponse>(searchUrl, { headers: this.headers });
  }
}
