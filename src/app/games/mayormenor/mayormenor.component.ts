import { Component, OnInit } from '@angular/core';
import { CartasService } from '../../services/game.service';
import { UserScore } from '../../services/auth/user-score';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-mayormenor',
  templateUrl: './mayormenor.component.html',
  styleUrl: './mayormenor.component.scss'
})

export class MayormenorComponent implements OnInit {

  cartas: any[] = [];
  cartaActual: any = null;
  deckId: string = '';
  mensajeFinal: string = '';
  score: number = 0;
  bestScore: number = 0;

  constructor(private cartasService: CartasService, private scoreService: ScoreService) { }
  ngOnInit(): void {
    this.iniciarJuego();
    this.loadUserScores();

  }
  async loadUserScores() {
    const email = localStorage.getItem('savedUserMail');
    if (email) {
      try {
        const userScores = await this.scoreService.getUserScores(email);
        const gameScore = userScores.find((g: UserScore) => g['game'] === 'MayorMenor');

        if (gameScore) {
          this.bestScore = gameScore.score;
        }
      } catch (error) {
        console.error('Error al cargar la puntuación:', error);
      }
    }
  }
  iniciarJuego(): void {
    this.cartasService.crearMazo().subscribe(data => {
      if (data && data.deck_id) {
        this.deckId = data.deck_id;
        this.sacarCarta();
      } else {
        console.error('No se obtuvo un deck_id ', data);
      }
    }, error => {
      console.error('Error al crear el mazo:', error);
    });
  }

  sacarCarta(): void {
    if (!this.deckId) {
      console.error('No se inicialiso el deckId');
      return;
    }

    this.cartasService.sacarCarta(this.deckId).subscribe(data => {
      if (data && data.cards && data.cards.length > 0) {
        const nuevaCarta = data.cards[0];
        this.cartas.push(nuevaCarta);
        this.cartaActual = nuevaCarta;
      } else {
        console.error('No se obtuvieron cartas:', data);
      }
    }, error => {
      console.error('Error al sacar carta:', error);
    });
  }


  adivinar(eleccion: string) {
    if (this.cartas.length < 52) {
      this.cartasService.sacarCarta(this.deckId).subscribe(data => {
        const cartaSiguiente = data.cards[0];
        const valorActual = this.obtenerValorCarta(this.cartaActual);
        const valorSiguiente = this.obtenerValorCarta(cartaSiguiente);
        this.score++;

        if ((eleccion === 'mayor' && valorSiguiente > valorActual) ||
          (eleccion === 'menor' && valorSiguiente < valorActual)) {
          this.cartas.push(cartaSiguiente);
          this.cartaActual = cartaSiguiente;
          this.mensajeFinal = '';
          this.updateBestScore();
        } else {
          this.mensajeFinal = 'Perdiste! La carta era: ' + cartaSiguiente.value;
          this.saveCurrentScore();
        }
      });
    } else {
      this.mensajeFinal = 'Ganaste! Has llegado al final.';
    }
  }
  async saveCurrentScore() {
    const email = localStorage.getItem('savedUserMail');
    const game = 'MayorMenor';
    const date = new Date().toISOString();

    if (email) {
      try {
        await this.scoreService.saveOrUpdateGameScore(email, this.score, game);

        console.log('Puntuación guardada:', this.score);
      } catch (error) {
        console.error('Error al guardar la puntuación:', error);
      }
    }
  }

  async updateBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      const email = localStorage.getItem('savedUserMail');
      const game = 'MayorMenor';
      const date = new Date().toISOString();

      if (email) {
        try {
          await this.scoreService.saveOrUpdateGameScore(email, this.bestScore, game);


          console.log('Puntaje máximo actualizado');
        } catch (error) {
          console.error('Error al actualizar el puntaje:', error);
        }
      }
    }
  }

  obtenerValorCarta(carta: any): number {
    const valoresCartas: any = {
      'ACE': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      'JACK': 11,
      'QUEEN': 12,
      'KING': 13
    };
    return valoresCartas[carta.value];
  }

  reiniciarJuego() {
    this.cartas = [];
    this.cartaActual = null;
    this.mensajeFinal = '';
    this.score = 0;
    this.iniciarJuego();
  }
}
