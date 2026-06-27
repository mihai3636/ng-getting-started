import { Component, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService, UserProfileDoc } from '../../core/firestore/firestore';
import { UserProfileForm } from './userProfile.model';

@Component({
  selector: 'app-profile',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    FormField,
    MatProgressSpinner,
  ],
  template: `
    <section>
      <div class="container profile flow-content">
        <h1 class="mat-font-display-sm">Profile</h1>
        <form (ngSubmit)="onSubmit()" class="form">
          <mat-form-field class="form__field">
            <mat-label>Email</mat-label>
            <input matInput [value]="userProfileForm.email().value()" disabled />
          </mat-form-field>
          <mat-form-field class="form__field">
            <mat-label>Display name</mat-label>
            <input matInput [formField]="userProfileForm.displayName" />
          </mat-form-field>
          <mat-form-field class="form__field">
            <mat-label>Favorite movie</mat-label>
            <input matInput [formField]="userProfileForm.favoriteMovie" />
          </mat-form-field>
          <div class="form__footer">
            <mat-error>
              @if (profileResource.error(); as err) {
                <span>{{ err.message }}</span>
                <button type="button" (click)="profileResource.reload()">Reload</button>
              }
              @if (saveError(); as err) {
                {{ err }}
              }
            </mat-error>
            <button
              type="submit"
              matButton="filled"
              [disabled]="isSaving() || profileResource.error()"
            >
              Submit
            </button>
          </div>
        </form>

        @if (profileResource.isLoading() || isSaving()) {
          <div class="section__overlay"></div>
          <mat-spinner class="spinner"></mat-spinner>
        }
      </div>
    </section>
  `,
  styles: `
    .container {
      padding-top: var(--sp-7);
      position: relative;
    }
    .form {
      --flow-spacer: var(--sp-6);
    }

    .form__field {
      width: 100%;
    }

    .form__footer {
      display: flex;
      justify-content: space-between;
    }
  `,
})
export default class ProfilePageComponent {
  private readonly firestoreService = inject(FirestoreService);

  profileResource = rxResource({
    stream: () => {
      return this.firestoreService.getUserProfile();
    },
  });

  readonly userProfileModel = linkedSignal<UserProfileForm>(() => {
    const defaultModel = toFormModel({});

    if (!this.profileResource.hasValue()) {
      return defaultModel;
    }

    const value = this.profileResource.value();

    return toFormModel(value);
  });

  readonly userProfileForm = form(this.userProfileModel);

  readonly saveError = signal<string>('');

  readonly isSaving = signal<boolean>(false);

  private _snackBar = inject(MatSnackBar);

  constructor() {}

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  onSubmit() {
    const docModel = toDocModel(this.userProfileModel());
    this.isSaving.set(true);
    this.saveError.set('');

    this.firestoreService.updateUserProfile(docModel).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.openSnackBar('Profile updated', 'Ok');
      },
      error: (err: Error) => {
        this.isSaving.set(false);
        this.saveError.set(err.message);
      },
    });
  }
}

function toFormModel(doc: UserProfileDoc): UserProfileForm {
  return {
    email: doc.email ?? '',
    displayName: doc.displayName ?? '',
    favoriteMovie: doc.favoriteMovie ?? '',
  };
}

function toDocModel(form: UserProfileForm): UserProfileDoc {
  const doc: UserProfileDoc = {};

  if (form.email) doc.email = form.email;
  if (form.displayName) doc.displayName = form.displayName;
  if (form.favoriteMovie) doc.favoriteMovie = form.favoriteMovie;

  return doc;
}
