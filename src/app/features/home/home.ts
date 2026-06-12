import { Component } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-home',
  imports: [MatSlideToggle],
  template: `
    <section>
      <div class="container">
        <p class="mat-font-display-sm">Test</p>
        <p class="mat-font-display-md">Test</p>
        <p class="mat-font-display-lg">Test</p>

        <p class="mat-font-headline-sm">Test</p>
        <p class="mat-font-headline-md">Test</p>
        <p class="mat-font-headline-lg">Test</p>

        <p class="mat-font-body-sm">Test</p>
        <p class="mat-font-body-md">Test</p>
        <p class="mat-font-body-lg">Test</p>

        <p class="mat-font-label-sm">Test</p>
        <p class="mat-font-label-md">Test</p>
        <p class="mat-font-label-lg">Test</p>

        <mat-slide-toggle>Toggle me!</mat-slide-toggle>
      </div>
    </section>
  `,
  styles: ``,
})
export class HomePageComponent {}
