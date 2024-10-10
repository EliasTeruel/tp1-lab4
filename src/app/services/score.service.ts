import { Injectable } from "@angular/core";
import { Firestore, collection, query, where, orderBy, getDocs, doc, setDoc, getDoc } from "@angular/fire/firestore";
import { map, Observable } from "rxjs";
import { UserScore } from "./auth/user-score";

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  constructor(private firestore: Firestore) {}

  async getUserScores(): Promise<UserScore[]> {
    try {
      const scoresCollection = collection(this.firestore, 'scores');
      const scoresSnapshot = await getDocs(scoresCollection);
      const usersScores: UserScore[] = scoresSnapshot.docs.map(doc => doc.data() as UserScore);
  
      console.log('Scores retrieved:', usersScores);
  
      return usersScores.filter(user => user["score"] !== undefined)
                        .sort((a, b) => (b["score"] || 0) - (a["score"] || 0));
    } catch (error) {
      console.error('Error al obtener las puntuaciones:', error);
      return []; 
    }
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


  getAllScoresByGame(game: string): Observable<any[]> {
    const scoresCollection = collection(this.firestore, 'userScores');
    const q = query(scoresCollection, where('game', '==', game), orderBy('score', 'desc'));
    return new Observable((observer) => {
      getDocs(q).then((snapshot) => {
        const scores = snapshot.docs.map(doc => doc.data());
        observer.next(scores);
        observer.complete();
      });
    });
  }

  getUserRank(email: string, game: string): Observable<number> {
    return this.getAllScoresByGame(game).pipe(
      map((scores) => {
        const userScore = scores.find((score) => score.email === email);
        if (userScore) {
          const rank = scores.findIndex((score) => score.email === email) + 1;
          return rank;
        } else {
          return -1; 
        }
      })
    );
  }
}
