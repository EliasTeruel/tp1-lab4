import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, setDoc, getDoc, query, where, limit, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userInfoSubject = new BehaviorSubject<any>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  private loginStatus = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatus.asObservable();

  constructor(private firestore: Firestore, private auth: Auth) { }

  async setTempUserInfo(email: string, name: string) {
    const userRef = doc(this.firestore, `tempUsers/${email}`);
    await setDoc(userRef, { name, email }, { merge: true });
  }

  async getTempUserInfo(email: string) {
    const userRef = doc(this.firestore, `tempUsers/${email}`);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  }

  async updateUserInfo(user: { email: string; firstName?: string; lastName?: string }) {
    console.log('Actualizando usuario:', user);

    try {
      const userRef = doc(this.firestore, `users/${user.email}`);
      await setDoc(userRef, user, { merge: true });
      this.userInfoSubject.next(user);
    } catch (error) {
      console.error('Error al actualizar Firestore:', error);
    }
  }

  async getUserInfoFromFirestore(email: string): Promise<any> {
    try {
      const userRef = doc(this.firestore, `users/${email}`);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;

      // if (!querySnapshot.empty) {
      //   const userDoc = querySnapshot.docs[0];
      //   return userDoc.data();
      // } else {
      //   console.log('Usuario no encontrado');
      //   return null;
      // }
    } catch (error) {
      console.error('Error al obtener el usuario de Firestore:', error);
      return null;
    }
  }
//   private loginStatus = new BehaviorSubject<boolean>(false);

//   loginStatus$ = this.loginStatus.asObservable();

  updateLoginStatus(isLoggedIn: boolean) {
    this.loginStatus.next(isLoggedIn);
  }
  
}
