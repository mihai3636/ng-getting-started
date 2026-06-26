import { inject, Service } from '@angular/core';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { Auth } from '../auth/auth';

@Service()
export class FirestoreService {
  private readonly authService = inject(Auth);
  private readonly db = getFirestore();

  private readonly collectionUsers = 'users';

  getUserProfile(): Observable<UserProfileDoc> {
    const userDocId = `user_${this.authService.getUserEmail()}`;

    const userRef = doc(this.db, this.collectionUsers, userDocId);

    return from(getDoc(userRef)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) return snapshot.data() as UserProfileDoc;
        return { email: this.authService.getUserEmail() } as UserProfileDoc;
      }),
    );
  }

  updateUserProfile(data: UserProfileDoc) {
    const userDocId = `user_${this.authService.getUserEmail()}`;
    const userRef = doc(this.db, this.collectionUsers, userDocId);

    return from(setDoc(userRef, data, { merge: true }));
  }
}

export interface UserProfileDoc {
  email?: string;
  displayName?: string;
  favoriteMovie?: string;
}
