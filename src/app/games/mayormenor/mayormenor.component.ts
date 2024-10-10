import { Component, OnInit } from '@angular/core';
import { CartasService } from '../../services/game.service';

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

  constructor(private cartasService: CartasService) { }
  ngOnInit(): void {
    this.iniciarJuego();
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
        } else {
          this.mensajeFinal = 'Perdiste! La carta era: ' + cartaSiguiente.value;
        }
      });
    } else {
      this.mensajeFinal = 'Ganaste! Has llegado al final.';
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
