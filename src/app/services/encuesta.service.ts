import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class EncuestaService {
  constructor(private firestore: Firestore) {}

  async saveEncuesta(data: any): Promise<void> {
    const encuestaCollection = collection(this.firestore, 'encuestas');
    await addDoc(encuestaCollection, data);
  }
}
