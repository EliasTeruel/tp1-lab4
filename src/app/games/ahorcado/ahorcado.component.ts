import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss']
})
export class AhorcadoComponent implements OnInit {
  palabraSecreta: string = '';
  palabraMostrada: string[] = [];
  letrasIncorrectas: string[] = [];
  intentosRestantes: number = 6;
  letrasAdivinadas: string[] = [];
  juegoTerminado: boolean = false;
  mensajeFinal: string = '';
  score: number = 0;
  bestScore: number = 0;

  listaPalabras: string[] = ['ANGULAR', 'PROGRAMACION', 'HOLA'];

  constructor(private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.iniciarJuego();
    this.loadUserScores();
  }
  async loadUserScores() {
    const email = localStorage.getItem('savedUserMail');
    if (email) {
      try {
        const userScores = await this.scoreService.getUserScores(email);
        const gameScore = userScores.find((g) => g['game'] === 'ahorcado');
        if (gameScore) {
          this.bestScore = gameScore.score;
        }
      } catch (error) {
        console.error('Error al cargar la puntuación:', error);
      }
    }
  }


  iniciarJuego() {
    this.palabraSecreta = this.generarPalabraSecreta();
    this.palabraMostrada = Array(this.palabraSecreta.length).fill('_');
    this.letrasIncorrectas = [];
    this.intentosRestantes = 6;
    this.juegoTerminado = false;
    this.mensajeFinal = '';
    this.letrasAdivinadas = [];
  }

  generarPalabraSecreta(): string {
    const indiceAleatorio = Math.floor(Math.random() * this.listaPalabras.length);
    return this.listaPalabras[indiceAleatorio];
  }

  adivinarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasAdivinadas.includes(letra)) {
      return;
    }

    this.letrasAdivinadas.push(letra);

    if (this.palabraSecreta.includes(letra)) {
      this.palabraSecreta.split('').forEach((l, index) => {
        if (l === letra) {
          this.palabraMostrada[index] = letra;
        }
      });
      this.score++;
    } else {
      this.letrasIncorrectas.push(letra);
      this.intentosRestantes--;
    }

    this.verificarEstadoDelJuego();
  }

  verificarEstadoDelJuego() {
    if (!this.palabraMostrada.includes('_')) {
      this.juegoTerminado = true;
      this.mensajeFinal = '¡Ganaste!';
      this.saveCurrentScore();
    } else if (this.intentosRestantes <= 0) {
      this.juegoTerminado = true;
      this.mensajeFinal = `¡Perdiste! La palabra era: ${this.palabraSecreta}`;
      this.saveCurrentScore();
    }
  }
  async saveCurrentScore() {
    const email = localStorage.getItem('savedUserMail');
    const game = 'ahorcado';

    if (email) {
      try {
        if (this.score > this.bestScore) {
          this.bestScore = this.score;
          await this.scoreService.saveOrUpdateGameScore(email, this.bestScore, game);
          console.log('Nueva puntuación guardada:', this.bestScore);
        }
      } catch (error) {
        console.error('Error al guardar la puntuación:', error);
      }
    }
  }

  reiniciarJuego() {
    this.iniciarJuego();
  }
}
