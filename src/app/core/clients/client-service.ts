import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, map } from 'rxjs';
import { Auth } from '../auth/auth';
import { DocClient, FirestoreService } from '../firestore/firestore';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly firestoreService = inject(FirestoreService);
  private readonly auth = inject(Auth);

  private readonly createClientRequest = signal<{ data: DocClient; ts: number } | undefined>(
    undefined,
  );

  readonly createClientResource = rxResource({
    params: () => this.createClientRequest(),
    stream: ({ params }) => {
      console.log('createClientResource params: ', params);
      // The loader does not fire when params is undefined!
      // if (!params) {
      //   console.log('Returning empty observable');
      //   return EMPTY;
      // }
      return this.firestoreService.createClient(params.data);
    },
  });

  resetClientRequest() {
    this.createClientRequest.set(undefined);
  }

  addClient(clientForm: UiClient) {
    const userId = this.auth.currentUser()?.uid!!;
    const clientDoc: DocClient = { ...clientForm, userId: userId };

    this.createClientRequest.set({ data: clientDoc, ts: Date.now() });
  }

  getClients() {
    const userId = this.auth.currentUser()?.uid!!;
    return this.firestoreService.getClients(userId).pipe(
      map((docs) => docs.map((fsDoc) => ({ id: fsDoc.id, ...fsDoc.data }) as UiClientItem)),
      delay(2000),
      // map((docs) => {
      //   throw Error('Test error');
      // }),
    );
  }
}

export interface UiClient {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date | null;
}

export interface UiClientItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date | null;
}
