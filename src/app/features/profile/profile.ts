import { Component, effect, inject, signal } from '@angular/core';
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
            <button type="submit" matButton="filled" [disabled]="isSaving()">Submit</button>
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
      justify-content: end;
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

  readonly userProfileModel = signal<UserProfileForm>({
    email: '',
    displayName: '',
    favoriteMovie: '',
  });
  readonly userProfileForm = form(this.userProfileModel);

  readonly isSaving = signal<boolean>(false);

  private _snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      if (!this.profileResource.hasValue()) {
        console.log(`Effect has no value`);
        return;
      }

      const value = this.profileResource.value();
      console.log('Effect changed: ', value);

      if (!value) return;

      this.userProfileModel.set(toFormModel(value));
    });

    effect(() => {
      console.log('Error is: ', this.profileResource.error());
    });
  }

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

    this.firestoreService.updateUserProfile(docModel).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.openSnackBar('Profile updated', 'Ok');
      },
      error: (err: Error) => {
        this.isSaving.set(false);
        this.openSnackBar(`Error, profile did not update: ${err.message}`, 'Ok');
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

export function toDocModel(form: UserProfileForm): UserProfileDoc {
  const doc: UserProfileDoc = {};

  if (form.email) doc.email = form.email;
  if (form.displayName) doc.displayName = form.displayName;
  if (form.favoriteMovie) doc.favoriteMovie = form.favoriteMovie;

  return doc;
}
