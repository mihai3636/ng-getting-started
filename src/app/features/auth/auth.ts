import { Component, computed, effect, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounce, email, form, FormField, minLength, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginData } from '../../core/login.model';

@Component({
  selector: 'app-auth',
  imports: [MatFormFieldModule, MatInputModule, MatCardModule, MatButton, FormField, FormsModule],
  template: `
    <section>
      <div class="container login">
        <form (ngSubmit)="onSignIn()" class="form">
          <mat-card>
            <mat-card-content>
              <mat-form-field class="form__login" appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" [formField]="loginForm.email" />
                <mat-error>{{ emailErrorComputed() }}</mat-error>
                <!-- @for (error of loginForm.email().errors(); track error.kind) {
                  <mat-error>{{ error.message }}</mat-error>
                } -->
              </mat-form-field>
              <mat-form-field class="form__password" appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput type="password" [formField]="loginForm.password" />
                <mat-error>{{ passwordErrorComputed() }}</mat-error>
              </mat-form-field>
            </mat-card-content>
            <mat-card-actions align="end">
              <button
                type="submit"
                matButton="filled"
                [disabled]="loginForm.email().invalid() || loginForm.password().invalid()"
              >
                Sign in
              </button>
            </mat-card-actions>
          </mat-card>
        </form>
      </div>
    </section>
  `,
  styles: `
    @use '../../../partials/variables' as *;
    @use '../../../partials/utils' as *;

    .login {
      padding-top: #{toRem(100px)};
    }

    .form {
      max-width: #{toRem(450px)};
      margin-inline: auto;
    }

    mat-form-field {
      width: 100%;
    }
  `,
})
export default class AuthPage {
  readonly loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  readonly loginForm = form(this.loginModel, (schemaPath) => {
    debounce(schemaPath.email, 200);
    required(schemaPath.email, { message: 'Please enter an email address' });
    email(schemaPath.email, { message: 'Invalid email format' });
    minLength(schemaPath.email, 7, { message: 'Min length is 7' });

    debounce(schemaPath.password, 200);
    required(schemaPath.password, { message: 'Password required!' });
    minLength(schemaPath.password, 5, { message: 'Password too small' });
  });

  readonly emailErrorComputed: Signal<string> = computed(() => {
    if (this.loginForm.email().errors().length === 0) return '';
    return this.loginForm.email().errors()[0].message ?? '';
  });

  readonly passwordErrorComputed: Signal<string> = computed(() => {
    if (this.loginForm.password().errors().length === 0) return '';
    return this.loginForm.password().errors()[0].message ?? '';
  });

  constructor() {
    effect(() => {
      console.log(this.loginForm.email().errors());
    });
    effect(() => {
      console.log(this.emailErrorComputed());
    });
  }

  onSignIn() {
    console.log('Sign in  clicked', this.loginForm.password().value());
  }
}
