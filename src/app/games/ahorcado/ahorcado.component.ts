import { Component, OnInit } from '@angular/core';

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

  listaPalabras: string[] = ['ANGULAR', 'PROGRAMACION', 'HOLA'];

  constructor() {}

  ngOnInit(): void {
    this.iniciarJuego();
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
    } else if (this.intentosRestantes <= 0) {
      this.juegoTerminado = true;
      this.mensajeFinal = `¡Perdiste! La palabra era: ${this.palabraSecreta}`;
    }
  }

  reiniciarJuego() {
    this.iniciarJuego();
  }
}
