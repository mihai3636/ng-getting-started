import { inject, Service } from '@angular/core';
import { doc, DocumentSnapshot, getDoc, getFirestore } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { Auth } from '../auth/auth';

@Service()
export class FirestoreService {
  private readonly authService = inject(Auth);
  private readonly db = getFirestore();

  private readonly collectionUsers = 'users';

  getUserProfile(): Observable<DocumentSnapshot> {
    const userDocId = `user_${this.authService.getUserEmail()}`;

    const userRef = doc(this.db, this.collectionUsers, userDocId);

    return from(getDoc(userRef));
  }
}
