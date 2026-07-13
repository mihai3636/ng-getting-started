import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, map, tap } from 'rxjs';
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

  getNextPage(pageSize: number, currentPage: UiClientItem[]) {
    const userId = this.auth.currentUser()?.uid!!;
    const cursor = currentPage.at(-1);

    return this.firestoreService.getClientsPageNext(userId, pageSize, cursor).pipe(
      map((docs) => docs.map((fsDoc) => ({ id: fsDoc.id, ...fsDoc.data }) as UiClientItem)),
      tap((data) => console.log('Received data: ', data)),
      // delay(2000),
      // map((docs) => {
      //   throw Error('Test error');
      // }),
    );
  }

  getPrevPage(pageSize: number, currentPage: UiClientItem[]) {
    const userId = this.auth.currentUser()?.uid!!;
    const cursor = currentPage.at(0);

    if (!cursor)
      throw new Error('You cannot fetch prev page without providing first item of the currentPage');

    return this.firestoreService.getClientsPagePrev(userId, pageSize, cursor).pipe(
      map((docs) => docs.map((fsDoc) => ({ id: fsDoc.id, ...fsDoc.data }) as UiClientItem)),
      tap((data) => console.log('Received data: ', data)),
      // delay(2000),
      // map((docs) => {
      //   throw Error('Test error');
      // }),
    );
  }

  getLastPage(pageSize: number, total: number) {
    const userId = this.auth.currentUser()?.uid!!;

    return this.firestoreService.getClientsPageLast(userId, pageSize, total).pipe(
      map((docs) => docs.map((fsDoc) => ({ id: fsDoc.id, ...fsDoc.data }) as UiClientItem)),
      tap((data) => console.log('Received data: ', data)),
    );
  }

  getCount() {
    const userId = this.auth.currentUser()?.uid!!;

    return this.firestoreService.getClientsCount(userId);
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
