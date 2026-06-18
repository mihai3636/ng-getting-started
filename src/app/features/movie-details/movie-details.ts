import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  imports: [],
  template: `
    <section>
      <div class="container">
        <h1>Movie details works! Here is the id: {{ paramId() }}</h1>
      </div>
    </section>
  `,
  styles: ``,
})
export default class MovieDetailsComponent {
  private route = inject(ActivatedRoute);
  private paramId$ = this.route.paramMap.pipe(map((params) => params.get('id')));

  protected paramId = toSignal(this.paramId$, { requireSync: true });
}
