import { Component } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { ScoreService } from '../../services/score.service';
import { UserScore } from '../../services/auth/user-score';

@Component({
  selector: 'app-juego2048',
  templateUrl: './juego2048.component.html',
  styleUrls: ['./juego2048.component.scss']
})
export class Juego2048Component {
  board: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score: number = 0;
  userScore: number = 0;
  bestScore: number = 0;
  mensajeFinal: string = '';

  ranking: any[] = []; 
  rankingVisible: boolean = false; 

  constructor(private loginService: LoginService, private scoreService: ScoreService) {
    this.inicializarJuego();
    this.loadUserScores();
  }

  inicializarJuego() {
    this.score = 0;
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addNewTile();
    this.addNewTile();
  }

  
  async loadUserScores() {
    const email = localStorage.getItem('savedUserMail');
    if (email) {
      try {
        const userScores = await this.scoreService.getUserScores(email);
        const gameScore = userScores.find((g: UserScore) => g['game'] === 'Juego 2048');
        if (gameScore) {
          this.bestScore = gameScore.score;
        }
      } catch (error) {
        console.error('Error al cargar la puntuación:', error);
      }
    }
  }
  addNewTile() {
    let emptyCells: { x: number, y: number }[] = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randIndex = Math.floor(Math.random() * emptyCells.length);
      const cell = emptyCells[randIndex];
      this.board[cell.x][cell.y] = Math.random() < 0.9 ? 2 : 4;

      setTimeout(() => {
        const newTile = document.querySelector(`.row:nth-child(${cell.x + 1}) .cell:nth-child(${cell.y + 1})`);
        if (newTile) {
          newTile.classList.add('new-tile');
          setTimeout(() => newTile.classList.add('active'), 10);
        }
      }, 10);
    }
  }

  move(direction: string) {
    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellElement = document.querySelector(`.row:nth-child(${rowIndex + 1}) .cell:nth-child(${colIndex + 1})`);
        if (cellElement) {
          cellElement.classList.add('moving');
        }
      });
    });

    setTimeout(() => {
      let boardChanged = false;

      switch (direction) {
        case 'up':
          boardChanged = this.moveUp();
          break;
        case 'down':
          boardChanged = this.moveDown();
          break;
        case 'left':
          boardChanged = this.moveLeft();
          break;
        case 'right':
          boardChanged = this.moveRight();
          break;
      }

      setTimeout(() => {
        this.board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            const cellElement = document.querySelector(`.row:nth-child(${rowIndex + 1}) .cell:nth-child(${colIndex + 1})`);
            if (cellElement) {
              cellElement.classList.remove('moving');
            }
          });
        });

        if (boardChanged) {
          this.addNewTile();
          if (this.checkGameOver()) {
            this.mensajeFinal = "Perdiste!";
          }
        }
      }, 300);
    }, 10);
  }



  combine(rowOrCol: number[]) {
    for (let i = 0; i < rowOrCol.length - 1; i++) {
      if (rowOrCol[i] !== 0 && rowOrCol[i] === rowOrCol[i + 1]) {
        rowOrCol[i] *= 2;
        rowOrCol[i + 1] = 0;
        this.score += rowOrCol[i];
      }
    }
    this.updateBestScore();
    return rowOrCol;
  }

  async updateBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      const email = localStorage.getItem('savedUserMail');
      const game = 'Juego 2048';
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


  slide(rowOrCol: number[]) {
    const nonZeroTiles = rowOrCol.filter(tile => tile !== 0);
    const zeros = new Array(4 - nonZeroTiles.length).fill(0);
    return [...nonZeroTiles, ...zeros];
  }

  moveUp() {
    let boardChanged = false;
    for (let col = 0; col < 4; col++) {
      let column = [this.board[0][col], this.board[1][col], this.board[2][col], this.board[3][col]];
      let original = [...column];
      column = this.slide(column);
      column = this.combine(column);
      column = this.slide(column);
      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
      if (column.toString() !== original.toString()) boardChanged = true;
    }
    return boardChanged;
  }

  moveDown() {
    let boardChanged = false;
    for (let col = 0; col < 4; col++) {
      let column = [this.board[3][col], this.board[2][col], this.board[1][col], this.board[0][col]];
      let original = [...column];
      column = this.slide(column);
      column = this.combine(column);
      column = this.slide(column);
      for (let row = 0; row < 4; row++) {
        this.board[3 - row][col] = column[row];
      }
      if (column.toString() !== original.toString()) boardChanged = true;
    }
    return boardChanged;
  }

  moveLeft() {
    let boardChanged = false;
    for (let row = 0; row < 4; row++) {
      let rowArray = [...this.board[row]];
      let original = [...rowArray];
      rowArray = this.slide(rowArray);
      rowArray = this.combine(rowArray);
      rowArray = this.slide(rowArray);
      this.board[row] = rowArray;
      if (rowArray.toString() !== original.toString()) boardChanged = true;
    }
    return boardChanged;
  }

  moveRight() {
    let boardChanged = false;
    for (let row = 0; row < 4; row++) {
      let rowArray = [...this.board[row]].reverse();
      let original = [...rowArray];
      rowArray = this.slide(rowArray);
      rowArray = this.combine(rowArray);
      rowArray = this.slide(rowArray);
      this.board[row] = rowArray.reverse();
      if (rowArray.toString() !== original.toString()) boardChanged = true;
    }
    return boardChanged;
  }


  checkGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) return false;
        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) return false;
        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) return false;
      }
    }
    this.saveCurrentScore();
    return true;
  }

  async saveCurrentScore() {
    const email = localStorage.getItem('savedUserMail');
    const game = 'Juego 2048';
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
}