import { DatePipe } from '@angular/common';
import { Component, effect, inject, linkedSignal, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ClientService, UiClientItem } from '../../core/clients/client-service';

@Component({
  selector: 'app-home',
  imports: [MatTableModule, DatePipe, MatProgressSpinnerModule, MatPaginatorModule],
  template: `
    <section>
      <div class="container">
        @if (clientsResource.isLoading()) {
          <div class="section__overlay"></div>
          <mat-spinner class="spinner"></mat-spinner>
        }
        @if (clientsResource.error()) {
          <p>Something went wrong: {{ clientsResource.error()?.message }}</p>
        }
        <!-- @if (clientsResource.hasValue()) {
          @for (client of clientsResource.value(); track client.id) {
            <h2>{{ client.lastName }} {{ client.firstName }}</h2>
          }
        } -->

        <table mat-table [dataSource]="clients()" class="mat-shadow-2">
          <!-- Position Column -->
          <ng-container matColumnDef="firstName">
            <th mat-header-cell *matHeaderCellDef>First Name</th>
            <td mat-cell *matCellDef="let element">{{ element.firstName }}</td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="lastName">
            <th mat-header-cell *matHeaderCellDef>Last Name</th>
            <td mat-cell *matCellDef="let element">{{ element.lastName }}</td>
          </ng-container>

          <!-- Weight Column -->
          <ng-container matColumnDef="dateOfBirth">
            <th mat-header-cell *matHeaderCellDef>Date of birth</th>
            <td mat-cell *matCellDef="let element">
              {{ element.dateOfBirth | date: 'dd/MM/yyyy' }}
            </td>
          </ng-container>

          <!-- Symbol Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let element">{{ element.email }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="4">No data available</td>
          </tr>
        </table>
        <mat-paginator
          [pageSize]="3"
          [length]="20"
          [hidePageSize]="true"
          [showFirstLastButtons]="false"
          (page)="handlePageEvent($event)"
          showFirstLastButtons
          aria-label="Select page of periodic elements"
        >
        </mat-paginator>
      </div>
    </section>
    <!-- <section>
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
    </section> -->
  `,
  styles: `
    .container {
      position: relative;
    }
  `,
})
export class HomePageComponent {
  displayedColumns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email'];
  private readonly clientService = inject(ClientService);

  pageEvent = signal<PageEvent>({
    previousPageIndex: undefined,
    pageIndex: 0,
    pageSize: 3,
    length: 20,
  });

  clientsResource: ResourceRef<UiClientItem[] | undefined> = rxResource({
    params: () => ({ pageEvent: this.pageEvent() }),
    stream: ({ params }) => {
      if (params.pageEvent.previousPageIndex === undefined) {
        return this.clientService.getNextPage(params.pageEvent.pageSize, []);
      }

      if (params.pageEvent.previousPageIndex > params.pageEvent.pageIndex) {
        return this.clientService.getPrevPage(params.pageEvent.pageSize, this.clients());
      }

      return this.clientService.getNextPage(params.pageEvent.pageSize, this.clients());
    },
  });

  clients = linkedSignal<UiClientItem[] | undefined, UiClientItem[]>({
    source: () => {
      try {
        return this.clientsResource.value();
      } catch (err) {
        console.log('LinkedSignal got error: ', err);
        return [];
      }
    },
    computation: (source, previous) => source ?? previous?.value ?? [],
  });

  constructor() {
    effect(() => {
      this.clients().forEach((client) => console.log(client.dateOfBirth));
    });
  }

  handlePageEvent(event: PageEvent) {
    console.log(event);
    this.pageEvent.set(event);
  }
}
