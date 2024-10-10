import { Component } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { ScoreService } from '../../services/score.service';

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
  bestScore: number = 0;

  ranking: any[] = []; 
  rankingVisible: boolean = false; 

  constructor(private loginService: LoginService, private scoreService: ScoreService) {
    this.inicializarJuego();
    this.mostrarRanking();
  }

  async mostrarRanking() {
    this.ranking = await this.scoreService.getUserScores();
    this.rankingVisible = true; 
    console.log('Ranking visible:', this.rankingVisible); 
}

// async mostrarRanking() {
//   this.ranking = await this.scoreService.getScores().toPromise();
//   this.rankingVisible = true; 
//   console.log('Ranking visible:', this.ranking); 
// }

  cerrarRanking() {
    this.rankingVisible = false; 
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
            alert('Game Over');
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
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
    return rowOrCol;
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

//    this.scoreService.saveScore(this.score).then(() => {
    console.log('Puntuación guardada:', this.score);
  //}).catch(error => {
    //console.error('Error al guardar la puntuación:', error);
 // });
    return true;
  }
}
