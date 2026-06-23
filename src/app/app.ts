import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <main>
      <app-navbar />
      <router-outlet />
    </main>
  `,
  styles: `
    // main {
    //   min-height: 100vh;

    //   display: grid;
    //   grid-template-rows: auto 1fr;
    // }

    // router-outlet {
    //   display: none;
    // }
  `,
})
export class App {
  protected readonly title = signal('getting-started');
}
