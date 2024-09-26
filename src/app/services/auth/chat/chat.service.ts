import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, orderBy, query, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: Firestore) { }

  getMessages(): Observable<any[]> {
    const messagesRef = collection(this.firestore, 'chats');
    const messagesQuery = query(messagesRef, orderBy('timestamp'));
    return collectionData(messagesQuery, { idField: 'id' });
  }

  async sendMessage(sender: string, message: string, senderName: string): Promise<void> {
    const messagesRef = collection(this.firestore, 'chats');
    await addDoc(messagesRef, {
      sender: sender,
      senderName: senderName,
      message: message,
      timestamp: new Date()
    });
  }
  
}
