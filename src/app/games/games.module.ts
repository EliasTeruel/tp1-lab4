import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Juego2048Component } from './juego2048/juego2048.component'; 
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayormenorComponent } from './mayormenor/mayormenor.component';
import { PreguntadosComponent } from './preguntados/preguntados.component';

@NgModule({
  declarations: [
    Juego2048Component,
    AhorcadoComponent,
    MayormenorComponent,
    PreguntadosComponent
  ], 
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'juego2048', component: Juego2048Component },
      { path: 'ahorcado', component: AhorcadoComponent },
      { path: 'mayormenor', component: MayormenorComponent },
      { path: 'preguntados', component: PreguntadosComponent }
    ])
  ],
  exports: [AhorcadoComponent]
})
export class GamesModule { }
