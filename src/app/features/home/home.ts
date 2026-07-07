import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ClientService } from '../../core/clients/client-service';

@Component({
  selector: 'app-home',
  imports: [MatSlideToggle],
  template: `
    <section>
      <div class="container">
        <h1>It works</h1>
        @if (clientsResource.isLoading()) {
          <p>Loading...</p>
        }
        @if (clientsResource.error()) {
          <p>Something went wrong: {{ clientsResource.error()?.message }}</p>
        }
        @if (clientsResource.hasValue()) {
          @for (client of clientsResource.value(); track client.id) {
            <h2>{{ client.lastName }} {{ client.firstName }}</h2>
          }
        }
      </div>
    </section>
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
export class HomePageComponent {
  private readonly clientService = inject(ClientService);

  clientsResource = rxResource({
    stream: () => this.clientService.getClients(),
  });
}
