import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  ResourceRef,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { debounce, form, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ClientService, UiClientItem } from '../../core/clients/client-service';

@Component({
  selector: 'app-home',
  imports: [
    MatTableModule,
    DatePipe,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
  ],
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
        <form>
          <mat-form-field>
            <mat-label>Search</mat-label>
            <input matInput type="text" [formField]="searchForm.query" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </form>

        <table mat-table [dataSource]="clients()" class="mat-shadow-2">
          <ng-container matColumnDef="firstName">
            <th mat-header-cell *matHeaderCellDef>First Name</th>
            <td mat-cell *matCellDef="let element">{{ element.firstName }}</td>
          </ng-container>

          <ng-container matColumnDef="lastName">
            <th mat-header-cell *matHeaderCellDef>Last Name</th>
            <td mat-cell *matCellDef="let element">{{ element.lastName }}</td>
          </ng-container>

          <ng-container matColumnDef="dateOfBirth">
            <th mat-header-cell *matHeaderCellDef>Date of birth</th>
            <td mat-cell *matCellDef="let element">
              {{ element.dateOfBirth | date: 'dd/MM/yyyy' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let element">{{ element.email }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="4">No data available</td>
          </tr>
        </table>
        <mat-paginator
          [pageSize]="3"
          [length]="count()"
          [hidePageSize]="true"
          [showFirstLastButtons]="true"
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

    .mat-column-firstName,
    .mat-column-lastName,
    .mat-column-dateOfBirth,
    .mat-column-email {
      width: 25%;
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
      const prevPageIndex = params.pageEvent.previousPageIndex;
      const pageIndex = params.pageEvent.pageIndex;
      const pageSize = params.pageEvent.pageSize;
      const total = params.pageEvent.length;

      if (prevPageIndex === undefined) {
        return this.clientService.getNextPage(params.pageEvent.pageSize, []);
      }

      if (prevPageIndex - pageIndex > 1) {
        return this.clientService.getNextPage(params.pageEvent.pageSize, []);
      }

      if (prevPageIndex > pageIndex) {
        return this.clientService.getPrevPage(params.pageEvent.pageSize, this.clients());
      }

      if (pageIndex - prevPageIndex > 1) {
        return this.clientService.getLastPage(pageSize, total);
      }

      return this.clientService.getNextPage(params.pageEvent.pageSize, this.clients());
    },
  });

  countResource = rxResource({
    params: () => ({ query: this.searchForm.query().value() }),
    stream: ({ params }) => {
      return this.clientService.getCount(params.query);
    },
  });

  count = computed(() => {
    try {
      return this.countResource.value();
    } catch (err) {
      return 0;
    }
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

  private readonly SEARCH_MODEL_DEFAULT = { query: '' };
  readonly searchModel = signal<SearchData>(this.SEARCH_MODEL_DEFAULT);
  readonly searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, 500);
  });

  constructor() {
    effect(() => {
      this.clients().forEach((client) => console.log(client.dateOfBirth));
    });

    effect(() => {
      console.log(this.searchForm.query().value());
    });
  }

  handlePageEvent(event: PageEvent) {
    console.log(event);
    this.pageEvent.set(event);
  }
}

interface SearchData {
  query: string;
}
