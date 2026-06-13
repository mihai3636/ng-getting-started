import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import env from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { TmdbResponse, Movie } from './movie.model';

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

  getTopRatedMovies(): Observable<Movie[]> {
    console.log(this.headers);
    return this.httpClient
      .get<TmdbResponse>(this.url, {
        headers: this.headers,
      })
      .pipe(map((response) => response.results));
  }
}
