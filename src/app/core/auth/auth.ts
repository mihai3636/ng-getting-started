import { Service, signal } from '@angular/core';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { from } from 'rxjs';

@Service()
export class Auth {
  private readonly auth = getAuth();

  private currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  private authReadySignal = signal(false);
  authReady = this.authReadySignal.asReadonly();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      console.log(`onAuthStateChanged: `, user);
      this.authReadySignal.set(true);
      this.currentUserSignal.set(user);
    });
  }

  signIn(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logOut() {
    return from(signOut(this.auth));
  }
}
