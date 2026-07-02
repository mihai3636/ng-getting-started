import { Component, effect, inject, signal } from '@angular/core';
import { debounce, email, form, FormField, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ClientService } from '../../core/clients/client-service';
import { SnackbarService } from '../../shared/snackbar';

@Component({
  selector: 'app-client-create',
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatProgressSpinner,
    MatDatepickerModule,
  ],
  template: `
    <section>
      <div class="container client flow-content">
        <h1 class="mat-font-display-sm">Add client</h1>
        <form class="form" (submit)="onSubmit($event)">
          <div class="form__fields">
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput [formField]="clientForm.email" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>First Name</mat-label>
              <input matInput [formField]="clientForm.firstName" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>Last Name</mat-label>
              <input matInput [formField]="clientForm.lastName" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>Phone</mat-label>
              <input matInput [formField]="clientForm.phone" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>Choose a date</mat-label>
              <input matInput [matDatepicker]="picker" [formField]="clientForm.dateOfBirth" />
              <mat-hint>DD/MM/YYYY</mat-hint>
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="form__footer">
            <mat-error>{{ clientService.createClientResource.error()?.message }}</mat-error>
            <button matButton="filled" type="submit" [disabled]="!clientForm().valid()">
              Submit
            </button>
          </div>
        </form>

        @if (clientService.createClientResource.isLoading()) {
          <div class="section__overlay"></div>
          <mat-spinner class="spinner"></mat-spinner>
        }
      </div>
    </section>
  `,
  styles: `
    @use '../../../partials/variables' as *;
    @use '../../../partials/utils' as *;

    .container {
      padding-top: var(--sp-7);
      position: relative;
    }
    .form {
      --flow-spacer: var(--sp-6);
    }

    .form__fields {
      display: grid;

      @media (min-width: $bp-tablet) {
        grid-template-columns: 1fr 1fr;
        column-gap: var(--sp-6);
      }
    }

    .form__footer {
      display: flex;
      justify-content: end;
      align-items: center;
      gap: var(--sp-4);
    }
  `,
})
export default class ClientCreatePage {
  readonly clientService = inject(ClientService);
  readonly snackbar = inject(SnackbarService);

  private readonly CLIENT_MODEL_DEFAULT = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: null,
  };

  readonly clientModel = signal({ ...this.CLIENT_MODEL_DEFAULT });

  readonly clientForm = form(this.clientModel, (schema) => {
    debounce(schema.email, 200);
    email(schema.email);

    debounce(schema.firstName, 200);
    required(schema.firstName);

    debounce(schema.lastName, 200);
    required(schema.lastName);

    debounce(schema.phone, 200);
    required(schema.phone);
    // pattern(schema.phone, /^(\+40|0)[237]\d{8}$/, { message: 'Invalid Romanian phone number' });
  });

  constructor() {
    effect(() => {
      if (this.clientService.createClientResource.status() === 'resolved') {
        this.snackbar.openSnackBar('Client created successfully', 'Ok');
        this.clientForm().reset({ ...this.CLIENT_MODEL_DEFAULT });
      }
    });
    effect(() => {
      console.log(`Error message is: ${this.clientService.createClientResource.error()?.message}`);
      if (this.clientService.createClientResource.error()?.message) {
        this.snackbar.openSnackBar('ERROR: Client was NOT created!', 'Ok');
      }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.clientService.addClient(this.clientModel());
  }
}
