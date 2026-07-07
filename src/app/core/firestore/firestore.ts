import { inject, Service } from '@angular/core';
import {
  collection,
  doc,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { from, map, Observable, switchMap } from 'rxjs';
import { Auth } from '../auth/auth';

const docClientConverter: FirestoreDataConverter<DocClient> = {
  toFirestore(client: DocClient) {
    return { ...client };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
      dateOfBirth: data['dateOfBirth'] ? (data['dateOfBirth'] as Timestamp).toDate() : null,
    } as DocClient;
  },
};

@Service()
export class FirestoreService {
  private readonly authService = inject(Auth);
  private readonly db = getFirestore();

  private readonly collectionUsers = 'users';
  private readonly collectionClients = 'clients';

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

    return from(setDoc(userRef, data, { merge: false }));
    // .pipe(
    //   map(() => {
    //     throw Error('Failed to update data, please try again');
    //   }),
    // );
  }

  createClient(data: DocClient) {
    const docId = `client_${data.userId}_${data.firstName}_${data.lastName}`;
    const docRef = doc(this.db, this.collectionClients, docId);

    return from(getDoc(docRef)).pipe(
      switchMap((snapshot) => {
        if (snapshot.exists()) throw new Error('Client already exists');
        return from(setDoc(docRef, data, { merge: false }));
      }),
    );
  }

  getClients(userId: string): Observable<FirestoreDoc<DocClient>[]> {
    const clientsRef = collection(this.db, this.collectionClients).withConverter(
      docClientConverter,
    );

    const q = query(clientsRef, where('userId', '==', userId));

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((d) => {
          return {
            id: d.id,
            data: d.data() as DocClient,
          };
        });
      }),
    );
  }
}

export interface UserProfileDoc {
  email?: string;
  displayName?: string;
  favoriteMovie?: string;
}

export interface DocClient {
  email?: string;
  firstName: string;
  lastName: string;
  phone: string;
  userId: string;
  dateOfBirth: Date | null;
}

export interface FirestoreDoc<T> {
  id: string;
  data: T;
}
