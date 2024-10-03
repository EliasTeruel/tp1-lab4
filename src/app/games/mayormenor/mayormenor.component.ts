import { Component } from '@angular/core';

@Component({
  selector: 'app-mayormenor',
  templateUrl: './mayormenor.component.html',
  styleUrl: './mayormenor.component.scss'
})

export class MayormenorComponent {

cartas: string[] = [];
numCartas: number = 14;
cartaActual: number = 0;
mensajeFinal: string = '';
cartaPerdida: string = '';
score: number = 0;
cartasOrdenadas: string[] = [];
constructor() {
  this.cargarCartas();
  this.barajarCartas();
}

cargarCartas() {
  for (let i = 0; i < this.numCartas; i++) {
    this.cartas.push(`assets/images/mayormenor/mayormenor${i}.png`); 
  }
}

cargarCartaSigiente(carta: number)
{
  return this.cartas.push(`assets/images/mayormenor/mayormenor${carta}.png`);
}
barajarCartas() {
  this.cartasOrdenadas = this.cartas.sort(() => Math.random() - 0.5);
}

adivinar(eleccion: string) {
  if (this.cartaActual < this.cartasOrdenadas.length - 1) {
    const cartaSiguiente = this.cartasOrdenadas[this.cartaActual + 1];
    const valorActual = this.obtenerValorCarta(this.cartasOrdenadas[this.cartaActual]);
    const valorSiguiente = this.obtenerValorCarta(cartaSiguiente);
    this.score++;
console.log(valorSiguiente);
    if ((eleccion === 'mayor' && valorSiguiente > valorActual) || 
        (eleccion === 'menor' && valorSiguiente < valorActual)) {
      this.cartaActual++;
      this.mensajeFinal = '';
        this.cartaPerdida = '';
    } else {
      this.mensajeFinal = 'Perdiste! La carta era:';
        this.cartaPerdida = cartaSiguiente; 

    }
  } else {
    this.mensajeFinal = 'Ganaste! Has llegado al final.';
      this.cartaPerdida = ''; 
  }
}

obtenerValorCarta(carta: string): number {
  const resultado = carta.match(/(\d+)/);
  if (resultado) {
    return parseInt(resultado[0]);
  } else {
    console.error(`No se pudo obtener el valor de la carta: ${carta}`);
    return 0;
  }
}


reiniciarJuego() {
  this.cartaActual = 0;
  this.mensajeFinal = '';
  this.score = 0;

  this.barajarCartas();
}

}