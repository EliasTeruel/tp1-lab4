import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Juego2048Component } from './juego2048/juego2048.component'; 
import { AhorcadoComponent } from './ahorcado/ahorcado.component';

@NgModule({
  declarations: [
    Juego2048Component,
    AhorcadoComponent
  ], 
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'juego2048', component: Juego2048Component },
      { path: 'ahorcado', component: AhorcadoComponent }
    ])
  ],
  exports: [AhorcadoComponent]
})
export class GamesModule { }
