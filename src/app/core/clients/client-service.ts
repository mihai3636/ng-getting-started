import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
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
      if (!params) return EMPTY;
      return this.firestoreService.createClient(params.data);
    },
  });

  addClient(clientForm: UiClient) {
    const userId = this.auth.currentUser()?.uid!!;
    const clientDoc: DocClient = { ...clientForm, userId: userId };

    this.createClientRequest.set({ data: clientDoc, ts: Date.now() });
  }
}

export interface UiClient {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date | null;
}
