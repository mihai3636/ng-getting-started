import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounce, email, form, FormField, pattern, required } from '@angular/forms/signals';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ClientService } from '../../core/clients/client-service';

@Component({
  selector: 'app-client-create',
  imports: [
    FormField,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAnchor,
    MatButton,
    MatProgressSpinner,
  ],
  template: `
    <section>
      <div class="container client flow-content">
        <h1 class="mat-font-display-sm">Add client</h1>
        <form class="form" (ngSubmit)="onSubmit()">
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
          </div>

          <div class="form__footer">
            <mat-error>Something went wrong </mat-error>
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

  readonly clientModel = signal({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });

  readonly clientForm = form(this.clientModel, (schema) => {
    debounce(schema.email, 200);
    email(schema.email);

    debounce(schema.firstName, 200);
    required(schema.firstName);

    debounce(schema.lastName, 200);
    required(schema.lastName);

    debounce(schema.phone, 200);
    required(schema.phone);
    pattern(schema.phone, /^(\+40|0)[237]\d{8}$/, { message: 'Invalid Romanian phone number' });
  });

  onSubmit() {
    this.clientService.addClient(this.clientModel());
  }
}
