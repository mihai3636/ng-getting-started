export interface TmdbResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

export interface MovieState {
  data: Movie[];
  loading: Boolean;
  error: string | null;
}
