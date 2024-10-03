import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, setDoc, getDoc, query, where, limit, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { UserScore } from './user-score';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userInfoSubject = new BehaviorSubject<any>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  private loginStatus = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatus.asObservable();

  constructor(private firestore: Firestore, private auth: Auth) {
    this.auth.onAuthStateChanged(user => {
      this.updateLoginStatus(!!user);
    });
   }

 
   async getUserScores(): Promise<UserScore[]> {
    const scoresCollection = collection(this.firestore, 'scores');
    const scoresSnapshot = await getDocs(scoresCollection);
    const usersScores: UserScore[] = scoresSnapshot.docs.map(doc => doc.data() as UserScore);

    console.log('Scores retrieved:', usersScores); // Agrega esto para depuración

    return usersScores.filter(user => user["score"] !== undefined)
                      .sort((a, b) => (b["score"] || 0) - (a["score"] || 0));
}

async saveUserScore(email: string, score: number): Promise<void> {
  const scoreRef = doc(this.firestore, `scores/${email}`);
  await setDoc(scoreRef, { email, score }, { merge: true });
  console.log(`Puntaje de ${email} guardado: ${score}`);
}

async updateUserScore(email: string, points: number): Promise<void> {
 

  try {
    const scoreRef = doc(this.firestore, `scores/${email}`);
    const scoreDoc = await getDoc(scoreRef);

    if (scoreDoc.exists()) {
      const currentScore = scoreDoc.data()?.["score"] || 0;
      await setDoc(scoreRef, { score: currentScore + points }, { merge: true });
    } else {
      await setDoc(scoreRef, { score: points });
    }
    console.log(`Score actualizado para ${email}: ${points} puntos.`);
  } catch (error) {
    console.error('Error al actualizar el score:', error);
  }
}


   async login(userMail: string, userPWD: string): Promise<void> {
    try {
      const res = await signInWithEmailAndPassword(this.auth, userMail, userPWD);

      if (res.user.email) {
        localStorage.setItem('savedUserMail', res.user.email);

        const lastLogin = res.user.metadata?.lastSignInTime ? new Date(res.user.metadata.lastSignInTime) : null;
        const formattedLoginTime = lastLogin 
          ? `${lastLogin.toLocaleDateString()} ${lastLogin.toLocaleTimeString()}` 
          : 'Fecha no disponible';

        const userInfo = await this.getUserInfoFromFirestore(res.user.email);

        if (userInfo) {
          const userData = { 
            email: userInfo.email, 
            firstName: userInfo.firstName, 
            lastName: userInfo.lastName, 
            lastLoginTime: formattedLoginTime 
          };

          const scores = await this.getUserScores();
          const userScore = scores.find(score => score.email === userInfo.email)?.score || 0;
  
          await this.updateUserInfo(userData);
          this.updateLoginStatus(true);

          await this.saveUserScore(userInfo.email, userScore);
        }
      }
    } catch (e) {
      console.error("Error during login:", e);
      throw e;
    }
  }

  async setTempUserInfo(email: string) {
    const userRef = doc(this.firestore, `tempUsers/${email}`);
    await setDoc(userRef, { email }, { merge: true });
  }

  async getTempUserInfo(email: string) {
    const userRef = doc(this.firestore, `tempUsers/${email}`);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  }


  checkUserExists(email: string): Promise<boolean> {
    const usersCollection = collection(this.firestore, 'users'); 
    const q = query(usersCollection, where('email', '==', email)); 

    return getDocs(q).then(snapshot => {
      return !snapshot.empty;
    }).catch((error) => {
      console.error('Error al verificar si el usuario existe:', error);
      return false;
    });
  }
  

  async updateUserInfo(user: { email: string; firstName?: string; lastName?: string }) {
    if (!user.email) {
      console.error('El email del usuario no es válido.');
      return;
  }
  console.log('Actualizando información del usuario:', user.email);

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


    } catch (error) {
      console.error('Error al obtener el usuario de Firestore:', error);
      return null;
    }
  }



  updateLoginStatus(isLoggedIn: boolean) {
    this.loginStatus.next(isLoggedIn);
  }

  isLoggedIn(): boolean {
    return this.loginStatus.value;
  }
  
}
