
import { Injectable } from "@angular/core";
import { Firestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "@angular/fire/firestore";
import { UserScore } from "./auth/user-score";

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  constructor(private firestore: Firestore) {}

  async saveOrUpdateGameScore(email: string, newScore: number, game: string): Promise<void> {
    const userRef = doc(this.firestore, `scores/${email}`);
    const userDoc = await getDoc(userRef);
    const currentDate = new Date().toISOString();

    let games = userDoc.exists() ? userDoc.data()?.['games'] || [] : [];

    const existingGameIndex = games.findIndex((g: any) => g.game === game);

    if (existingGameIndex >= 0) {
      if (newScore > games[existingGameIndex].score) {
        games[existingGameIndex].score = newScore;
        games[existingGameIndex].date = currentDate;
      }
    } else {
      games.push({ game, score: newScore, date: currentDate });
    }

    await setDoc(userRef, { email, games }, { merge: true });
    console.log(`Puntaje guardado/actualizado para ${email} - Juego: ${game}, Puntuación: ${newScore}`);
  }

  async getUserScores(email: string): Promise<UserScore[]> {
    if (!email) {
      console.warn('No se proporcionó un email válido.');
      return [];
    }
    try {
      const userRef = doc(this.firestore, `scores/${email}`);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return data?.['games'] || [];
      }
      return [];
    } catch (error) {
      console.error('Error al obtener las puntuaciones del usuario:', error);
      return [];
    }
  }

  async getScoresByGame(game: string): Promise<UserScore[]> {
    
    try {
      const scoresCollection = collection(this.firestore, 'scores');
      const snapshot = await getDocs(scoresCollection);

      const gameScores: UserScore[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const games = data?.['games'] || [];

        const filteredGame = games.find((g: any) => g.game === game);
        if (filteredGame) {
          gameScores.push({
            email: data["email"],
            game: filteredGame.game,
            score: filteredGame.score,
            date: filteredGame.date,
          });
        }
      });

      return gameScores;
    } catch (error) {
      console.error('Error al obtener puntajes por juego:', error);
      return [];
    }
  }
}


