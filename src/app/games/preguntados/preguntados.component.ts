import { Component, OnInit } from '@angular/core';
import { SimpsonsService  } from '../../services/poke.service';
import { forkJoin } from 'rxjs';
import { ScoreService } from '../../services/score.service';
import { UserScore } from '../../services/auth/user-score';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss']
})
export class PreguntadosComponent implements OnInit {
  character: any;
  options: string[] = [];
  correctAnswer: string = '';
  score: number = 0;
  selectedAnswer: string | null = null;
  loading: boolean = true;
  lives: number = 3;
  gameOverMessage: string | null = null;
  bestScore: number = 0;


  constructor(private  simpsonsService: SimpsonsService, private scoreService: ScoreService) {}

  ngOnInit() {
    this.loadNewCharacter();
    this.loadUserScores();

  }

  async loadUserScores() {
    const email = localStorage.getItem('savedUserMail');
    if (email) {
      try {
        const userScores = await this.scoreService.getUserScores(email);
        const gameScore = userScores.find((g: UserScore) => g['game'] === 'preguntados');

        if (gameScore) {
          this.bestScore = gameScore.score;
        }
      } catch (error) {
        console.error('Error al cargar la puntuación:', error);
      }
    }
  }
  
  loadNewCharacter() {
    this.loading = true;
    this.gameOverMessage = null;

    this.fetchUniqueCharacters();
  }

  fetchUniqueCharacters() {
    this.simpsonsService.getRandomCharacters(4).subscribe(
      (characters) => {
        const uniqueCharacters = this.getUniqueOptions(characters);

        if (uniqueCharacters.length < 4) {
          this.fetchUniqueCharacters();
        } else {
          this.options = uniqueCharacters.map((c) => c[0].character);
          this.character = uniqueCharacters[Math.floor(Math.random() * 4)][0];
          this.correctAnswer = this.character.character;
          this.selectedAnswer = null;
          this.loading = false;
        }
      },
      () => {
        this.loading = false;
      }
    );
  }

  getUniqueOptions(characters: any[]): any[] {
    const uniqueMap = new Map();
    characters.forEach((char) => uniqueMap.set(char[0].character, char));
    return Array.from(uniqueMap.values()); 
  }

  generateOptions(correctName: string) {
    this.options = [correctName];
    const additionalOptions = ["Homer Simpson", "Bart Simpson", "Lisa Simpson", "Marge Simpson"];
    this.options = [...this.options, ...additionalOptions]
      .slice(0, 4);
    this.options = this.shuffleArray(this.options); 
    this.loading = false;
  }

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5); 
  }

  async checkAnswer(selectedOption: string) {
    this.selectedAnswer = selectedOption;

    if (selectedOption === this.correctAnswer) {
      this.score++;
      await this.saveBestScore();
    } else {
      this.lives--; 
    }

    
    if (this.lives <= 0) {
      this.gameOverMessage = `Perdiste! la puntuación fue: ${this.score}`;
      this.selectedAnswer = null;
      await this.saveCurrentScore();

    } else {
      setTimeout(() => this.loadNewCharacter(), 2000); 
    }
  }
  async saveBestScore() {
    const email = localStorage.getItem('savedUserMail');
    if (email && this.score > this.bestScore) {
      this.bestScore = this.score;
      try {
        await this.scoreService.saveOrUpdateGameScore(email, this.bestScore, 'preguntados');
        console.log('¡Nueva mejor puntuación guardada!');
      } catch (error) {
        console.error('Error al guardar la mejor puntuación:', error);
      }
    }
  }

  async saveCurrentScore() {
    const email = localStorage.getItem('savedUserMail');
    const game = 'preguntados';
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

  resetGame() {
    this.score = 0; 
    this.lives = 3;
    this.loadNewCharacter(); 
    this.saveCurrentScore();
  }
}


